
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import valid from "../i18n/validators.js";

import presto from "../model/Presto.js";
import OrganicaInc from "./inputs/OrganicaInc.js";
import Partidas from "./partidas.js";
import form from "./presto.js";

export default class PartidaInc extends FormBase {
	#organica = this.getElement("orgInc");
	#economica = this.getElement("ecoInc");
	#partidas = this.querySelector("table");

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.#partidas.init(); // initialize form before table
		this.#organica.addListener("afterSelect", () => { //select
			const item = this.#organica.getCurrent(); // current item
			api.init().json("/uae/presto/economicas/inc?org=" + item.value).then(this.#economica.setItems); // load economicas inc.
			form.setAvisoFa(item).setValue("faInc", item.int & 1); // organica afectada
		});
		this.#organica.addListener("reset", () => {
			this.setValue("faInc").setValue("impInc");
			this.#economica.clear();
		});

		this.#economica.setEmptyOption("Seleccione una económica");
		const fnEditableEjInc = () => (this.#partidas.isEmpty() && !presto.isDisableEjInc());
		this.set("is-editable-ej-dec", this.#partidas.isEmpty).set("is-editable-ej-inc", fnEditableEjInc).addChange("ejInc", this.#organica.reload);

		tabs.setAction("partida-inc-add", () => {
			if (!valid.partidaInc()) return; // errores al validar los campos de entrada
			const url = `/uae/presto/partida/add?org=${this.#organica.getValue()}&eco=${this.#economica.getValue()}`;
			api.init().json(url).then(partidaInc => { // fetch partida a incrementar
				if (!valid.partidaSrv(partidaInc)) return; // error en la partida a incrementar
				partidaInc.imp030 = partidaInc.imp = this.getValue("impInc"); // Importe de la partida a añadir
				this.#partidas.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
				this.#organica.reload(); // reseteo los valores del formulario
			});
		});
	}

	view = data => {
		this.#economica.clear(); // clear select box
		this.#partidas.render(data); // load table
	}

	getPartidas = () => this.#partidas;
	autoload(partida, imp) { this.#partidas.autoload(partida, imp); }
}

customElements.define("organica-inc", OrganicaInc, { extends: "input" });
customElements.define("partida-table", Partidas, { extends: "table" });
