
import factura from "../model/Factura.js";
import xeco from "../../xeco/xeco.js";
import lineas from "./lineas.js";

function Facturas() {
	//const self = this; //self instance
	const form = xeco.getForm();
	const acOrganica = form.setAcItems("#acOrganica", () => window.rcFindOrganica());
	const acRecibo = form.setAcItems("#acRecibo", () => window.rcFindRecibo());

	this.getForm = xeco.getForm;
	this.init = () => {
		xeco.init(); // init. actions
		lineas.init(); // init. las lineas de la factura

		const fnShowGestor = () => factura.isFace() || factura.isPlataforma();
		const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
		form.set("show-recibo", factura.isRecibo).set("show-factura-uae", fnShowFactUae).set("show-uae", factura.isUae)
			.set("show-gestor", fnShowGestor).set("show-face", factura.isFace).set("show-gaca", factura.isFirmaGaca)
			.set("show-factura", factura.isFacturable).set("show-cp", factura.isCartaPago).set("is-exento", factura.isExento)
			//.set("is-reactivable", factura.isReactivable)
			.onChangeInputs(".ui-pf", (ev, el) => { el.previousElementSibling.value = ev.target.value; }); // update pf inputs 
	}

	this.view = (data, conceptos, firmas) => {
		data.ivaPF = data.iva; // sync iva
		data.nifTercero = data.nif; // set field
		data.subtipoPF = data.subtipo; // sync subtipo
		xeco.view(data, firmas); // load data-model before view
		lineas.setLineas(conceptos); // Load conceptos and iva input
		acOrganica.setValue(data.idOrg, data.org + " - " + data.descOrg);
		acRecibo.setValue(data.idRecibo, data.acRecibo);
	}

	this.update = (data, firmas, tab) => {
		xeco.update(data, firmas, tab); // Update firmas blocks
	}
}

export default new Facturas();
