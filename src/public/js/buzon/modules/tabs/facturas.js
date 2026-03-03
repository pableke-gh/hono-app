
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";
import buzon from "../../model/Buzon.js";

export default class Facturas extends Form {
	#tipo = this.getInput("#tipo");
	#fileNames = this.querySelectorAll(".filename");
	#isActiveTab5; // bool indicators

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		const fnShowTab2 = () => { // tab fichero factura
			const fileName = this.querySelector(".filename").innerHTML;
			return fileName || !this.showError("Debe seleccionar una factura.");
		}
		const fnValidateJustPago = () => {
			const files = this.#fileNames.filter(el => el.innerHTML);
			if (buzon.isJustPagoRequired() && (files.length < 2))
				return !this.showError("Debe seleccionar Justificante de pago.");
			return true;
		}
	
		// Tab resumen
		const fnValidateTab5 = () => (!this.#isActiveTab5 || valid.tab5());
		const fnShowTab6 = () => (fnValidateJustPago() && fnValidateTab5());
		const fnViewTab6 = () => {
			const desc = this.getValue("desc");
			const names = this.#fileNames.filter(el => el.innerHTML).map(el => el.innerHTML);
			this.text("#ut-desc", this.getOptionText("utFact")).text("#file-name", names.join(", "))
				.text("#desc-gestor", desc).setVisible("#msg-gestor", desc)
				.text("#iban", this.getValue("cuentas"));
		}
	
		// Init. form factura
		const fnFile = (ev, el, file) => { el.nextElementSibling.innerHTML = file.name; };
		this.getElement("factura").onFile(fnFile); this.getElement("justPago").onFile(fnFile);

		tabs.setShowEvent(2, fnShowTab2); // tab fichero factura
		tabs.setActiveEvent(4, buzon.isActiveTab4).setShowEvent(4, fnValidateJustPago);
		tabs.setActiveEvent(5, () => this.#isActiveTab5).setShowEvent(5, fnValidateJustPago);
		tabs.setShowEvent(6, fnShowTab6).setViewEvent(6, fnViewTab6); // tab resumen
		tabs.setAction("upload", () => {
			const fd = this.getFormData(); // todo: replace by FormDataBox
			fd.append("org", buzon.isFacturaOtros() ? "" : buzon.getOrganica()); // organica seleccionada
			api.setFormData(fd).json("/uae/buzon/upload").then(() => this.fireReset().nextTab(0)); // upload form + clear inputs
		});
	}

	load = (uts, ut, desc) => {
		const list = this.getElement("utFact");
		list.setItems(uts).setValue(ut);
		return this.text("#org-desc", desc).refresh(buzon).nextTab(1);
	}

	setFactuaOrganica = data => {
		const isIsu = buzon.setData(data).setFacturaOtros().setTipoPago(+this.#tipo.value).isIsu();
		buzon.setJustPagoRequired(buzon.isPagoCesionario() && isIsu);
		this.setVisible(".show-isu", isIsu).setVisible(".show-no-isu", !isIsu)
			.setVisible("#file-jp", buzon.isJustPagoRequired())
			.setVisible(".show-cesionario", buzon.isPagoCesionario())
			.text("#type-name", this.getOptionText("tipo")).setValue("desc");
		this.#tipo.onchange = () => this.setFactuaOrganica(data); // update event
		this.#isActiveTab5 = false; // always hide otros
		return this;
	}
    setFactuaOtros = () => {
		buzon.setFacturaOtros(true).setTipoPago(+this.#tipo.value);
		buzon.setJustPagoRequired(buzon.isPagoCesionario());
		this.show(".show-isu").hide(".show-no-isu")
			.setVisible("#file-jp", buzon.isJustPagoRequired())
			.setVisible(".show-cesionario", buzon.isPagoCesionario())
			.text("#type-name", this.getOptionText("tipo"));
		this.#tipo.onchange = this.setFactuaOtros; // update event
		this.#isActiveTab5 = true; // show tab otros
		return this;
    }
}
