
import tables from "../../components/tables/Tables.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonEjecutar extends ButtonForm {
	setEditable() {
		this.setVisible(tables.get("docs").size());
	}

	execute() {
		const url = this.form.getAttribute("action"); // url base
		const row = tables.getSolicitudes().getCurrent(); // current row
		this.form.send(url + "/ejecutar?id=" + row.id, 3); // send data
	}
}
