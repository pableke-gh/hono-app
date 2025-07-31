
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import buzon from "../model/Buzon.js";
import xeco from "../../xeco/xeco.js";
import i18n from "../../i18n/langs.js";

function Facturas() {
	const self = this; //self instance
    const form = xeco.getForm();
	const elTipo = form.getInput("#tipo");
	const fileNames = form.querySelectorAll(".filename");
	let _isActiveTab5; // bool indicators

    this.init = (uts, ut, desc) => {
		form.setItems("#utFact", uts).setval("#utFact", ut).text("#org-desc", desc).refresh(buzon).nextTab(1);
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
		elTipo.onchange = self.setFactuaOtros; // update event
		_isActiveTab5 = true; // show tab otros
		return self;
    }

    const fnShowTab2 = () => { // tab fichero factura
        const fileName = form.querySelector(".filename").innerHTML;
        return fileName || !form.showError("Debe seleccionar una factura.");
    }
    const fnValidateJustPago = () => {
        const files = fileNames.filter(el => el.innerHTML);
        if (buzon.isJustPagoRequired() && (files.length < 2))
            return !form.showError("Debe seleccionar Justificante de pago.");
        return true;
    }

	// Tab resumen
	const fnValidateTab5 = data => {
		if (!_isActiveTab5)
			return true; // always ok
		const valid = i18n.getValidators();
		const msgs = "Debe detallar las observaciones para el gestor.";
		return valid.size("desc", data.desc, msgs).isOk();
	}
	const fnShowTab6 = () => (fnValidateJustPago() && form.validate(fnValidateTab5));
	const fnViewTab6 = () => {
		const desc = form.getval("#desc");
		const names = fileNames.filter(el => el.innerHTML).map(el => el.innerHTML);
		form.text("#ut-desc", form.getOptionText("#utFact")).text("#file-name", names.join(", "))
			.text("#desc-gestor", desc).setVisible("#msg-gestor", desc)
			.text("#iban", form.getval("#cuentas"));
	}

	// Init. form factura
	tabs.setShowEvent(2, fnShowTab2); // tab fichero factura
	tabs.setActiveEvent(4, buzon.isActiveTab4).setShowEvent(4, fnValidateJustPago);
	tabs.setActiveEvent(5, () => _isActiveTab5).setShowEvent(5, fnValidateJustPago);
	tabs.setShowEvent(6, fnShowTab6).setViewEvent(6, fnViewTab6); // tab resumen
	form.getInput("#fileFactura_input").setAttribute("accept", "application/pdf"); // PDF only
	tabs.setAction("upload", () => {
		const org = buzon.isFacturaOtros() ? "" : buzon.getOrganica();
		const fnResponse = msgs => form.showAlerts(msgs) && form.fireReset().nextTab(0); // clear inputs and message
		api.setJSON(form.getData()).json("/uae/buzon/upload?org=" + org).then(fnResponse); // upload form
	});
}

export default new Facturas();
