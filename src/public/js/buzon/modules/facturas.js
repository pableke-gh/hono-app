
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import buzon from "../model/Buzon.js";
import i18n from "../../i18n/langs.js";

function BuzonFacturas() {
	const self = this; //self instance
    const form = new Form("#xeco-factura");
	const elTipo = form.getInput("#tipo");
	const fileNames = form.querySelectorAll(".filename");
	let _unidadTramit, _isActiveTab5; // bool indicators

    this.getForm = () => form;
	this.setChangeTipo = fn => {
		elTipo.onchange = fn; // update event
		return self;
	}

    this.init = (cod, desc, ut) => {
		fileNames.forEach(el => { el.innerHTML = ""; });
		form.setval("#buzon-cod-org", cod).text("#org-desc", desc);
		_unidadTramit = ut;
		return self;
	}
    this.setFactuaOrganica = data => {
		const isIsu = buzon.setData(data).setFacturaOtros().setTipoPago(+elTipo.value).isIsu();
		buzon.setJustPagoRequired(buzon.isPagoCesionario() && isIsu);
		form.setVisible(".show-isu", isIsu).setVisible(".show-no-isu", !isIsu)
			.setVisible("#file-jp", buzon.isJustPagoRequired())
			.setVisible(".show-cesionario", buzon.isPagoCesionario())
			.text("#type-name", form.getOptionText("#tipo")).setval("#desc");
		elTipo.onchange = () => self.setFactuaOrganica(data); // update event
		_isActiveTab5 = false; // always hide otros
		return self;
	}
    this.setFactuaOtros = () => {
		buzon.setFacturaOtros(true).setTipoPago(+elTipo.value);
		buzon.setJustPagoRequired(buzon.isPagoCesionario());
		form.show(".show-isu").hide(".show-no-isu")
			.setVisible("#file-jp", buzon.isJustPagoRequired())
			.setVisible(".show-cesionario", buzon.isPagoCesionario())
			.text("#type-name", form.getOptionText("#tipo"));
		_isActiveTab5 = true; // show tab otros
		return self;
    }

    this.validateJustPago = () => {
        const files = fileNames.filter(el => el.innerHTML);
        if (buzon.isJustPagoRequired() && (files.length < 2))
            return !form.showError("Debe seleccionar Justificante de pago.");
        if (buzon.isFacturaOtros())
            return form.setval("#utFact", _unidadTramit) // default ut
        return true;
    }

    this.showTab2 = () => { // tab fichero factura
        const fileName = form.querySelector(".filename").innerHTML;
        return fileName || !form.showError("Debe seleccionar una factura.");
    }

	// Tab resumen
	const fnValidateTab5 = data => {
		if (!_isActiveTab5)
			return true; // always ok
		const valid = i18n.getValidators();
		const msgs = "Debe detallar las observaciones para el gestor.";
		return valid.size("desc", data.desc, msgs).isOk();
	}
	this.showTab6 = () => (self.validateJustPago() && form.validate(fnValidateTab5));
	this.viewTab6 = () => {
		const desc = form.getval("#desc");
		const names = fileNames.filter(el => el.innerHTML).map(el => el.innerHTML);
		form.text("#ut-desc", form.getOptionText("#utFact")).text("#file-name", names.join(", "))
			.text("#iban", form.getval("#cuentas"))
			.text("#desc-gestor", desc).setVisible("#msg-gestor", desc);
	}

	// Init. form factura
    pf.uploads(form.querySelectorAll(".pf-upload"));
	form.getInput("#fileFactura_input").setAttribute("accept", "application/pdf"); // PDF only
	tabs.setActiveEvent(4, buzon.isMultigrupo);
	tabs.setActiveEvent(5, () => _isActiveTab5);
}

export default new BuzonFacturas();
