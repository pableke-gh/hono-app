
import tabs from "../../../core/components/tabs/Tabs.js";
import api from "../../../core/components/Api.js"
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators.js";

import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonSubsanar extends ButtonForm {
	setEditable() {
		if (factura.isSubsanableUae()) this.setSubsanarMode();
		else if (factura.isSubsanableGaca()) this.setResetMode();
		else this.setReactivarMode(); // default mode

		const ok = factura.isReactivable() || factura.isSubsanableUae() || factura.isSubsanableGaca();
		this.setVisible(ok); // set visibility of button
		this.setDisabled(!ok); // set disabled state of button
	}

	setReactivarMode() {
		this.className = "btn btn-warn";
		this.innerHTML = '<i class="fas fa-wrench"></i>Reactivar';
		this.setAttribute("title", "Activa los campos modificables por la UAE");
	}
	setSubsanarMode() {
		this.className = "btn btn-green";
		this.innerHTML = '<i class="far fa-save"></i>Subsanar';
		this.setAttribute("title", "Guarda los cambios realizados");
	}
	setResetMode() {
		this.className = "btn btn-green";
		this.innerHTML = '<i class="far fa-save"></i>Subsanar';
		this.setAttribute("title", "Guarda los cambios realizados");
	}

	reactivar(data) {
		if (!i18n.confirm("msgReactivar"))
			return; // cancel by user
		data = data || form.getSolicitudes().getCurrent();
		if (form.isCached(data.id)) // solicitud pre-loaded
			return form.reactivate(factura.setSubsanable()); // show current data
		const url = "/uae/fact/reactivar?id=" + data.id;
		api.init().json(url).then(form.open); // get method
	}
	subsanar() {
		const data = valid.all(); // form data
		if (data && i18n.confirm("msgSave")) // validate and user confirmation
			api.setJSON(form.getFormData(data)).json("/uae/fact/subsanar").then(tabs.showList);
	}
	reset() {
		const data = valid.all(); // form data
		if (data && i18n.confirm("msgSave")) // validate and user confirmation
			api.setJSON(form.getFormData(data)).json("/uae/fact/reset").then(tabs.showList);
	}

	execute() { // click event button
		if (factura.isSubsanableUae()) this.subsanar();
		else if (factura.isSubsanableGaca()) this.reset();
		else this.reactivar(); // default mode
	}
}
