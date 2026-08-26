
import api from "../../../core/components/Api.js"
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonReport extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isDocumentable());
	}

	execute() {
		const row = form.getSolicitudes().getCurrent(); // current row
		api.init().text("/uae/iris/report?id=" + row.id).then(api.open);
	}
}
