
import Solicitud from "../../model/Solicitud.js";
import tables from "../../components/tables/Tables.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ButtonNotificar extends ButtonForm {
	setEditable() {
		const size = tables.get("docs").size();
		this.setVisible(size && Solicitud.getInstance().isNotificable());
	}

	execute() {
		const url = this.form.getAttribute("action"); // url base
		const row = tables.getSolicitudes().getCurrent(); // current row
		this.form.send(url + "/notificar?id=" + row.id, 4); // send data
	}
}
