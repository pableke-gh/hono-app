
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "../i18n/langs.js";

import factura from "./model/Factura.js";

import lineas from "./modules/lineas.js";
import fiscal from "./modules/fiscal.js";
import xeco from "../xeco/xeco.js";

coll.ready(() => {
	// init. modules actions
	xeco.init(); lineas.init(); fiscal.init();

	const form = xeco.getForm();
	const acOrganica = form.setAutocomplete("#acOrganica");
	const fnSourceOrg = term => api.init().json("/uae/fact/organicas", { term }).then(acOrganica.render);
	acOrganica.setItemMode(4).setSource(fnSourceOrg);

	const acRecibo = form.setAutocomplete("#acRecibo");
	const fnSourceRecibo = term => {
		const url = factura.isExtension() ? "/uae/fact/recibos/tpv" : "/uae/fact/recibos/ac";
		api.init().json(url, { term }).then(acRecibo.render);
	}
	acRecibo.setItemMode(4).setSource(fnSourceRecibo);

	const fnShowGestor = () => factura.isFace() || factura.isPlataforma();
	const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
	form.set("show-recibo", factura.isRecibo).set("show-factura-uae", fnShowFactUae).set("show-uae", factura.isUae)
		.set("show-gestor", fnShowGestor).set("show-face", factura.isFace).set("show-gaca", factura.isFirmaGaca)
		.set("show-factura", factura.isFacturable).set("show-cp", factura.isCartaPago).set("is-exento", factura.isExento);

	factura.view = data => {
		xeco.view(data.fact, data.firmas); // load data-model before view
		lineas.setLineas(data.lineas); // Load conceptos and iva input
		acOrganica.setValue(data.fact.idOrg, data.fact.org + " - " + data.fact.descOrg);
		acRecibo.setValue(data.fact.idRecibo, data.fact.acRecibo);
		// cargo los datos del tercero y de las delegaciones
		fiscal.load(data.tercero, data.delegaciones)
				.setTercero(data.fact.idTer, data.fact.nif + " - " + data.fact.tercero)
				.setSujeto(data.fact.sujeto) // update sujeto / exento
				.setFace(data.fact.face); // update face inputs group
	}

	const fnBuild = (tipo, subtipo) => ({ fact: { tipo, subtipo, imp: 0 } });
	tabs.setAction("factura", () => factura.view(fnBuild(1, 14))); // create factura
	tabs.setAction("cartap", () => factura.view(fnBuild(3, 13))); // create carta de pago

	function fnValidate(msgConfirm, url, tab) {
		factura.setLineas(lineas.getTable()); // actualizo los conceptos
		const data = form.validate(factura.validate);
		if (!data || !i18n.confirm(msgConfirm))
			return; // Errores al validar o sin confirmacion
		const temp = Object.assign(factura.getData(), data);
		temp.lineas = lineas.getTable().getData(); // lineas de la factura
		return api.setJSON(temp).json(url).then(msgs => tabs.showMsgs(msgs, tab));
	}
	tabs.setAction("send", () => fnValidate("msgSend", "/uae/fact/save", "init")); // send xeco-model form
	tabs.setAction("subsanar", () => fnValidate("msgSave", "/uae/fact/subsanar", "list")); // send from changes
});
