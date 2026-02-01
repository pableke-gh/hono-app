
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";
import valid from "../i18n/validators.js";

import buzon from "../model/Buzon.js";
import form from "../../xeco/modules/SolicitudForm.js";

function Facturas() {
	const self = this; //self instance
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
	const fnValidateTab5 = () => (!_isActiveTab5 || valid.tab5());
	const fnShowTab6 = () => (fnValidateJustPago() && fnValidateTab5());
	const fnViewTab6 = () => {
		const desc = form.getval("#desc");
		const names = fileNames.filter(el => el.innerHTML).map(el => el.innerHTML);
		form.text("#ut-desc", form.getOptionText("#utFact")).text("#file-name", names.join(", "))
			.text("#desc-gestor", desc).setVisible("#msg-gestor", desc)
			.text("#iban", form.getval("#cuentas"));
	}

	// Init. form factura
	form.onChangeFiles("[type=file]", (ev, el, file) => { el.nextElementSibling.innerHTML = file.name; });
	tabs.setShowEvent(2, fnShowTab2); // tab fichero factura
	tabs.setActiveEvent(4, buzon.isActiveTab4).setShowEvent(4, fnValidateJustPago);
	tabs.setActiveEvent(5, () => _isActiveTab5).setShowEvent(5, fnValidateJustPago);
	tabs.setShowEvent(6, fnShowTab6).setViewEvent(6, fnViewTab6); // tab resumen
	tabs.setAction("upload", () => {
		const fd = form.getFormData();
		fd.append("org", buzon.isFacturaOtros() ? "" : buzon.getOrganica()); // organica seleccionada
		api.setFormData(fd).json("/uae/buzon/upload").then(() => form.fireReset().nextTab(0)); // upload form + clear inputs
	});
}

export default new Facturas();
