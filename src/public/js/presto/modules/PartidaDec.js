
import FormBase from "../../components/forms/FormBase.js";
import Ejercicio from "../components/dec/Ejercicio.js";
import presto from "../model/Presto.js";
import form from "./presto.js";

export default class PartidaDec extends FormBase {
	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.addChange("imp", ev => { // autoload importe
			presto.isAutoLoadImp() && form.getPartidas().setImp(ev.target.getValue());
		});
	}

	view(data) {
		this.getElement("ej").setLabels(data.ejercicios);
	}
	reload() {
		this.getElement("orgDec").reload();
	}
}

customElements.define("ej-dec", Ejercicio, { extends: "select" });
