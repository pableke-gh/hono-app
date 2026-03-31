
import FormBase from "../../components/forms/FormBase.js";
import api from "../../components/Api.js"
import presto from "../model/Presto.js";
import OrganicaDec from "./inputs/OrganicaDec.js";
import EconomicaDec from "./inputs/EconomicaDec.js";
import form from "./presto.js";

export default class PartidaDec extends FormBase {
	#organica = this.getElement("orgDec"); // autocomplete
	#economica = this.getElement("ecoDec"); // data-list

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		const pInc = form.getPartidaInc();
		const partidas = pInc.getPartidas();

		this.#organica.select = item => { // override => final select
			presto.isAutoLoadInc() && partidas.reset(); //autoload => clear table
			const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
			api.init().json(url + "?org=" + item.value).then(this.#economica.reload); // reload economicas
			form.setAvisoFa(item).setValue("faDec", item.int & 1); // indicador de organica afectada
			return item.value;
		}
		this.#organica.addListener("reset", () => { // reset organica a decrementar
			presto.isAutoLoadInc() && partidas.reset(); //autoload => clear table
			this.#economica.clear();
			this.setValue("faDec");
		});

		this.addChange("ej", this.#organica.reload);
		this.addChange("imp", ev => { presto.isAutoLoadImp() && pInc.autoload(null, ev.target.getValue()); }); //importe obligatorio
	}

	view(data) {
		this.setLabels("select.ui-ej", data.ejercicios).setValue("faDec", data.solicitud.omask & 1);
	}
	reload() {
		this.#organica.reload();
	}
}

customElements.define("organica-dec", OrganicaDec, { extends: "input" });
customElements.define("economica-dec", EconomicaDec, { extends: "select" });
