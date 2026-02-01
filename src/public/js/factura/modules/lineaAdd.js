
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import valid from "../i18n/validators.js";

import factura from "../model/Factura.js";
import lineas from "./lineas.js";
import form from "../../xeco/modules/SolicitudForm.js";

function Lineas() {
	const self = this; //self instance
	const acRecibo = form.setAutocomplete("#acRecibo");
	const fnSourceRecibo = term => {
		const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
		api.init().json(url, { id: form.getval("#idOrg") || 0, term }).then(acRecibo.render);
	}
	acRecibo.setItemMode(4).setSource(fnSourceRecibo);

	const acTTPP = form.setAutocomplete("#acTTPP"); // si no ha seleccionado organica id = 0 (evita excepción en el servidor)
	const fnSource = term => api.init().json("/uae/ttpp/recibos", { id: form.getval("#idOrg") || 0, term }).then(acTTPP.render);
	acTTPP.setItemMode(4).setSource(fnSource);

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
			const data = valid.linea();
			if (!data) return; // error en las validaciones
			lineas.push(data); // añado la nueva linea
			form.restart("#desc").setval("#imp", 0);
		});
	}

	this.setIva = iva => {
		factura.setIva(iva); // set new iva value
		lineas.afterRender().refreshFooter(); // actualizo los totales de la subtabla de conceptos
	}

	this.view = data => {
		const fact = data.solicitud; // datos del servidor
		acRecibo.setValue(fact.idRecibo, fact.acRecibo);
		lineas.render(data.lineas); // render table
	}
}

export default new Lineas();
