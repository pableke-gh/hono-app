
import FormBase from "../../components/forms/FormBase.js";
import OrganicaDec from "../components/dec/Organica.js";
import presto from "../model/Presto.js";

export default class PartidaDec extends FormBase {
	#organica = this.getElement("orgDec"); // autocomplete

	reload() {
		this.#organica.reload();
	}
}

customElements.define("organica-dec", OrganicaDec, { extends: "input" });
