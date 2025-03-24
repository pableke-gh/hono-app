
import pf from "../../components/Primefaces.js";
import factura from "../model/Factura.js";
import xeco from "../../xeco/xeco.js";
import lineas from "./lineas.js";

function Facturas() {
	const self = this; //self instance
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
			.set("show-factura", factura.isFacturable).set("show-cp", factura.isCartaPago)
			.onChangeInput("[name=subtipo]", ev => { form.setStrval("#subtipoPF", ev.target.value); });
		return self;
	}

	this.view = (data, conceptos, firmas) => {
		data.nifTercero = data.nif; // set field
		data.titulo = factura.getTitulo(data.tipo); // set title for views
		xeco.view(data, firmas); // load data-model before view
		lineas.setLineas(conceptos); // Load conceptos and iva input
		acOrganica.setValue(data.idOrg, data.org + " - " + data.descOrg);
		acRecibo.setValue(data.idRecibo, data.acRecibo);
		return self;
	}

	this.setFirmas = (data, firmas) => {
		data.titulo = factura.getTitulo(data.tipo); // set title for views
		xeco.setFirmas(data, firmas); // Update firmas blocks
		return self;
	}
}

export default new Facturas();
