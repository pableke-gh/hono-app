
import api from "../../../core/components/Api.js";
import irse from "../../model/Irse.js";
import tables from "../tables/tables.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class ZipDocumentos extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isDisabled() && tables.get("gastos").getNumOtraDoc());
	}

	execute() { // download iris-doc.zip
		api.init().blob("/uae/iris/zip/doc", "iris-doc.zip");
	}
}
