
import api from "../../../core/components/Api.js";
import observer from "../../../core/util/Observer.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class Upload extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	upload(rutas) { // merge data to send
		const fd = form.getFormData(".ui-gasto").set("id", irse.getId()).set("trayectos", rutas); // set id + etapas
		api.setFormData(fd).json("/uae/iris/upload/gasto").then(data => observer.emit("link", data.gasto)); // send data
		form.getPaso5().beforeView();
	}

	execute() {
		valid.upload() && this.upload();
	}
}
