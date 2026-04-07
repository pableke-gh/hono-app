
import FormBase from "../../components/forms/FormBase.js";
import OrganicaDec from "../components/inputs/OrganicaDec.js";
import presto from "../model/Presto.js";
import form from "./presto.js";

export default class PartidaDec extends FormBase {
	#organica = this.getElement("orgDec"); // autocomplete

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.addChange("ej", this.#organica.reload);
		this.addChange("imp", ev => { // autoload importe
			presto.isAutoLoadImp() && form.getPartidas().setImp(ev.target.getValue());
		});
	}

	view(data) {
		this.setLabels("select.ui-ej", data.ejercicios).setValue("faDec", data.solicitud.omask & 1);
	}
	reload() {
		this.#organica.reload();
	}
}

customElements.define("organica-dec", OrganicaDec, { extends: "input" });
