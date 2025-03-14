
import pf from "../../components/Primefaces.js";
import factura from "../model/Factura.js";
import xeco from "../../xeco/xeco.js";

function Facturas() {
	const self = this; //self instance
	const form = xeco.getForm();
	const acOrganica = form.setAcItems("#acOrganica", term => pf.sendTerm("rcFindOrganica", term));
	const acRecibo = form.setAcItems("#acRecibo", term => pf.sendTerm("rcFindRecibo", term));

	this.getForm = xeco.getForm;
	this.init = () => {
		xeco.init(); // init. actions
		return self;
	}
	this.view = (data, firmas) => {
		xeco.view(data, firmas); // load data-model before view
		form.setval("#nifTercero", data.nif)
				.readonly(factura.isDisabled()).readonly(!factura.isEditableUae(), ".editable-uae") // disable iva input
				.setVisible(".show-recibo", factura.isRecibo()).setVisible(".show-factura", factura.isFacturable()).setVisible(".show-cp", factura.isCartaPago())
				.setVisible(".show-factura-uae", factura.isUae() && factura.isFacturable()).setVisible(".show-uae", factura.isUae())
				.setVisible(".show-gestor", factura.isFace() || factura.isPlataforma()).setVisible(".show-face", factura.isFace())
				.setVisible(".show-gaca", factura.isFirmaGaca());

		acOrganica.setValue(data.idOrg, data.org + " - " + data.descOrg);
		acRecibo.setValue(data.idRecibo, data.acRecibo);
		return self;
	}
	this.update = firmas => {
		xeco.update(firmas); // firmas asociadas
		return self;
	}
}

export default new Facturas();
