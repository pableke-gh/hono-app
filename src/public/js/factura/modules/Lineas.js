
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import factura from "../model/Factura.js";
import sf from "../../xeco/modules/SolicitudForm.js";

function Lineas() {
	const self = this; //self instance
	const form = sf.getForm();
	const linea = factura.getLinea();

	const acRecibo = form.setAutocomplete("#acRecibo");
	const fnSourceRecibo = term => {
		const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
		api.init().json(url, { id: form.getval("#idOrg") || 0, term }).then(acRecibo.render);
	}
	acRecibo.setItemMode(4).setSource(fnSourceRecibo);

	const acTTPP = form.setAutocomplete("#acTTPP"); // si no ha seleccionado organica id = 0 (evita excepción en el servidor)
	const fnSource = term => api.init().json("/uae/ttpp/recibos", { id: form.getval("#idOrg") || 0, term }).then(acTTPP.render);
	acTTPP.setItemMode(4).setSource(fnSource);

	const lineas = form.setTable("#lineas-fact", linea.getTable());
	lineas.setAfterRender(resume => {
		resume.impIva = resume.imp * (factura.getIva() / 100);
		resume.impTotal = resume.imp + resume.impIva; // total conceptos + importe iva
	});

	this.init = () => {
		form.onChangeInput("#iva", ev => self.setIva(+ev.target.value));
		tabs.setAction("addLinea", () => {
			if (factura.isTtppEmpresa()) {
				form.closeAlerts(); // hide prev. errors
				const recibo = acTTPP.getCurrentItem();
				if (recibo) // push recibo in the table
					lineas.push({ cod: recibo.value, desc: recibo.label, imp: recibo.imp });
				return acTTPP.reload();
			}
			const data = form.validate(linea.validate);
			if (!data) return; // error en las validaciones
			lineas.push(data); // añado la nueva linea
			form.restart("#desc").setval("#imp", 0);
		});
	}

	this.setIva = iva => {
		factura.setIva(iva); // set new iva value
		lineas.afterRender().refreshFooter(); // actualizo los totales de la subtabla de conceptos
	}

	this.getTable = () => lineas
	this.view = data => {
		const fact = data.solicitud; // datos del servidor
		acRecibo.setValue(fact.idRecibo, fact.acRecibo);
		lineas.render(data.lineas); // render table
	}
}

export default new Lineas();
