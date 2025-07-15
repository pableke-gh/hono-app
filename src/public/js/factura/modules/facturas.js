
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import factura from "../model/Factura.js";

import lineas from "./lineas.js";
import fiscal from "./fiscal.js";
import xeco from "../../xeco/xeco.js";

function Facturas() {
	//const self = this; //self instance
	const form = xeco.getForm();

	const acOrganica = form.setAutocomplete("#acOrganica");
	const fnSourceORg = term => api.init().json(`/uae/fact/organicas?term=${term}`).then(acOrganica.render);
	acOrganica.setItemMode(4).setSource(fnSourceORg);

	const acRecibo = form.setAutocomplete("#acRecibo");
	const fnSourceRecibo = term => api.init().json(`/uae/fact/recibos?term=${term}`).then(acRecibo.render);
	acRecibo.setItemMode(4).setSource(fnSourceRecibo);

	this.getForm = xeco.getForm;
	this.init = () => {
		// init. modules actions
		xeco.init(); lineas.init(); fiscal.init();

		const fnShowGestor = () => factura.isFace() || factura.isPlataforma();
		const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
		form.set("show-recibo", factura.isRecibo).set("show-factura-uae", fnShowFactUae).set("show-uae", factura.isUae)
			.set("show-gestor", fnShowGestor).set("show-face", factura.isFace).set("show-gaca", factura.isFirmaGaca)
			.set("show-factura", factura.isFacturable).set("show-cp", factura.isCartaPago).set("is-exento", factura.isExento)
			.onChangeInputs(".ui-pf", (ev, el) => { el.previousElementSibling.value = ev.target.value; }); // update pf inputs 
	}

	this.view = data => {
		data.fact.ivaPF = data.fact.iva; // sync iva
		data.fact.nifTercero = data.fact.nif; // set field
		data.fact.subtipoPF = data.fact.subtipo; // sync subtipo
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

	factura.view = this.view; // load view when list action
	this.update = data => xeco.update(data.fact, data.firmas, data.tab); // Update view

	// xeco-model form actions
	function fnValidate(msgConfirm, fn) {
		factura.setLineas(lineas.getTable()); // actualizo los conceptos
		if (!form.validate(factura.validate) || !i18n.confirm(msgConfirm))
			return false; // Errores al validar o sin confirmacion
		// set iva value in pf field, serialize table data and call to specific action
		form.copy("#ivaPF", "#iva").saveTable("#lineas-json", lineas.getTable()).invoke(fn);
	}
	tabs.setAction("send", () => fnValidate("msgSend", window.rcSend)); // send xeco-model form
	tabs.setAction("subsanar", () => fnValidate("msgSave", window.rcSubsanar)); // send from changes
}

export default new Facturas();
