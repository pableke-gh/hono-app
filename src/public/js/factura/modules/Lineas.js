
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import factura from "../model/Factura.js";
import xeco from "../../xeco/xeco.js";

function Lineas() {
	const self = this; //self instance
	const form = xeco.getForm();
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
	lineas.set("isFacturable", factura.isFacturable);
	lineas.setAfterRender(() => {
		const fnChangeIva = ev => self.setIva(+ev.target.value);
		form.setLabels("#iva", [0, 4, 10, 21]).setField("#iva", factura.getIva(), fnChangeIva);
		self.setIva(factura.getIva());
	});

	this.setIva = iva => {
		factura.setIva(iva);
		const resume = lineas.getResume();
		resume.impIva = resume.imp * (iva / 100);
		resume.impTotal = resume.imp + resume.impIva; // total conceptos + importe iva
		lineas.refreshFooter(); // actualizo los totales de la subtabla de conceptos
	}

	this.getTable = () => lineas
	this.setLineas = data => {
		acRecibo.setValue(data.fact.idRecibo, data.fact.acRecibo);
		lineas.render(data.lineas);
	}

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

export default new Lineas();
