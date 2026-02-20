
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import valid from "../i18n/validators.js";

import presto from "../model/Presto.js";
import Partidas from "./partidas.js";
import form from "./presto.js";

export default class PartidaInc extends Form {
	#acOrgInc = this.setAutocomplete("#acOrgInc");
	#ecoInc = this.setDatalist("#idEcoInc");
	#partidas = new Partidas(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.#partidas.init();
		const fnSelect = item => {
			api.init().json("/uae/presto/economicas/inc?org=" + item.value).then(this.#ecoInc.setItems); // load economicas inc.
			form.setAvisoFa(item).setValue("#faInc", item.int & 1); // organica afectada
		}
		const fnSource = term => {
			const url = presto.isGcr() ? "/uae/presto/organicas/inc/gcr" : "/uae/presto/organicas/inc"; // url by type
			api.init().json(url, { ej: this.getval("#ejInc"), term }).then(this.#acOrgInc.render); // send fetch
		}
		const fnReset = () => { this.setValue("#faInc").setValue("#impInc"); this.#ecoInc.reset(); }
		this.#acOrgInc.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelect).setReset(fnReset);

		this.#ecoInc.setEmptyOption("Seleccione una económica");
		const fnEditableEjInc = () => (this.#partidas.isEmpty() && !presto.isDisableEjInc());
		this.set("is-editable-ej-dec", this.#partidas.isEmpty).set("is-editable-ej-inc", fnEditableEjInc).onChangeInput("#ejInc", this.#acOrgInc.reload);

		tabs.setAction("partida-inc-add", () => {
			if (!valid.partidaInc()) return; // errores al validar los campos de entrada
			const url = `/uae/presto/partida/add?org=${this.#acOrgInc.getValue()}&eco=${this.#ecoInc.getValue()}`;
			api.init().json(url).then(partidaInc => { // fetch partida a incrementar
				if (!valid.partidaSrv(partidaInc)) return; // error en la partida a incrementar
				partidaInc.imp030 = partidaInc.imp = this.valueOf("#impInc"); // Importe de la partida a añadir
				this.#partidas.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
				this.#acOrgInc.reload(); // reseteo los valores del formulario
			});
		});
		tabs.setAction("save030", () => {
			if (!valid.validate030()) // validate partida 080 / 030
				return false; // not valid data
			if (presto.isEditable()) // if editable => back to presto view, send table on tab-action-send
				return tabs.backTab().showOk("Datos del documento 030 asociados correctamente.");
			api.setJSON(this.#partidas.getData()).json("/uae/presto/save/030").then(tabs.showForm);
		});
	}

	view = data => {
		this.#ecoInc.reset(); // clear select box
		this.#partidas.render(data); // load table
	}

	autoload(partida, imp) {
		this.#partidas.autoload(partida, imp);
	}

	getPartidas = () => this.#partidas;
}
