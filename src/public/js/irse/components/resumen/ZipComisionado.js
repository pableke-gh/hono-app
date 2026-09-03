
import api from "../../../core/components/Api.js";
import irse from "../../model/Irse.js";
import tables from "../tables/tables.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ZipComisionado extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isDisabled() && tables.get("gastos").getNumDocComisionado());
		this.previousElementSibling.classList.toggle("hide", !irse.isDocumentable()); // report button
	}

	execute() { // download iris-facturas.zip
		api.init().blob("/uae/iris/zip/com", "iris-facturas.zip");
	}
}
