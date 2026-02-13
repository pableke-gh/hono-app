
import Form from "../../components/forms/Form.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

// partials forms
export default class PrestoForm extends Form {
	constructor() { super("#xeco-model"); }

	setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item.int) && (presto.isTcr() || presto.isFce()) && this.showInfo(info);
		return this;
	}
}
