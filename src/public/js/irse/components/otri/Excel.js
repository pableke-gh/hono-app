
import api from "../../../core/components/Api.js"
import otri from "../../model/Otri.js";
import xlsx from "../../services/xlsx.js";
import { KEYS, TITILES } from "../../data/isu.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";

export default class Excel extends ButtonForm {
	setEditable() {
		this.setReadonly(false);
	}

	execute() { // form click event button
		api.init().json("/uae/iris/isu/excel").then(data => {
			const sheet = "listado-isu";
			const aux = data.map(obj => Object.clone(obj, KEYS));
			xlsx.setData(sheet, aux, otri.xlsx).setTitles(sheet, TITILES);
			xlsx.download("Informe ISU.xlsx"); // download XLSX file
		});
	}
}
