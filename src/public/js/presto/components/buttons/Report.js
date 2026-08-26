
import api from "../../../core/components/Api.js"
import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonReport extends ButtonForm {
	setEditable() {
		this.setVisible(presto.isDocumentable());
	}

	execute() {
		const row = form.getSolicitudes().getCurrent(); // current row
		api.init().text("/uae/presto/report?id=" + row.id).then(api.open);
	}
}
