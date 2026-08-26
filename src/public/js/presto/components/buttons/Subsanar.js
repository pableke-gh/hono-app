
import tabs from "../../../core/components/tabs/Tabs.js";
import api from "../../../core/components/Api.js"
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js"

export default class ButtonSubsanar extends ButtonForm {
	setEditable() {
		if (presto.isSubsanable()) this.setSubsanarMode();
		else this.setReactivarMode(); // default mode

		const ok = presto.isReactivable() || presto.isSubsanable();
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

	reactivar(data) {
		if (!i18n.confirm("msgReactivar"))
			return; // cancel by user
		data = data || form.getSolicitudes().getCurrent();
		if (form.isCached(data.id)) // solicitud pre-loaded
			return form.reactivate(presto.setSubsanable()); // show current data
		const url = "/uae/presto/reactivar?id=" + data.id;
		api.init().json(url).then(form.open); // get method
	}
	subsanar() {
		if (valid.all() && i18n.confirm("msgSave")) // validate and user confirmation
			api.setFormData(form.getFormData()).send("/uae/presto/subsanar").then(tabs.showList);
	}

	execute() {
		if (presto.isSubsanable()) this.subsanar();
		else this.reactivar(); // default mode
	}
}
