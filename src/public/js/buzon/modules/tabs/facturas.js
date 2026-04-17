
import FormHTML from "../../../components/forms/FormHTML.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators.js";
import buzon from "../../model/Buzon.js";

export default class FacturasForm extends FormHTML {
	#tipo = this.getElement("tipo");
	#factura = this.getElement("factura");
	#justPago = this.getElement("justPago");
	#isActiveTab5; // bool indicators

	connectedCallback() {
		const fnShowTab2 = () => (this.#factura.isLoaded() || !this.showError("Debe seleccionar una factura."));
		const fnValidateJustPago = () => {
			if (buzon.isJustPagoRequired() && (this.#justPago.isEmpty()))
				return !this.showError("Debe seleccionar Justificante de pago.");
			return true;
		}
	
		// Tab resumen
		const fnValidateTab5 = () => (!this.#isActiveTab5 || valid.tab5());
		const fnShowTab6 = () => (fnValidateJustPago() && fnValidateTab5());
		const fnViewTab6 = () => {
			const desc = this.getValue("desc");
			const names = this.querySelectorAll(".filename").map(el => el.innerText).join(", ");
			this.text("#ut-desc", this.getOptionText("utFact")).text("#file-name", names)
				.text("#desc-gestor", desc).setVisible("#msg-gestor", desc)
				.text("#iban", this.getValue("cuentas"));
		}
	
		// Init. form factura
		const fnFile = (el, file) => el.setText(file.getFilename());
		this.set("factura-name", fnFile).set("just-name", fnFile);

		tabs.setNextEvent(1, fnShowTab2); // tab fichero factura
		tabs.setNextEvent(2, fnValidateJustPago).setActiveEvent(4, buzon.isActiveTab4);
		tabs.setActiveEvent(5, () => this.#isActiveTab5).setNextEvent(5, fnShowTab6);
		tabs.setNextEvent(6, fnShowTab6).setViewEvent(6, fnViewTab6); // tab resumen
		tabs.setAction("upload", () => {
			const fd = this.getFormData(); // todo: replace by FormDataBox
			fd.add("org", buzon.isFacturaOtros() ? "" : buzon.getOrganica()); // organica seleccionada
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
