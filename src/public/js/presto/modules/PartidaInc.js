
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import valid from "../i18n/validators.js";

import p030 from "./partida030.js";
import presto from "../model/Presto.js";
import partidas from "./partidas.js";
import Form from "./form.js";

class PartidaInc extends Form {
	#acOrgInc = this.setAutocomplete("#acOrgInc");
	#ecoInc = this.setDatalist("#idEcoInc");

	constructor() {
		super(); // call super before to use this reference
	
		const fnSelect = item => {
			api.init().json("/uae/presto/economicas/inc?org=" + item.value).then(this.#ecoInc.setItems); // load economicas inc.
			this.setAvisoFa(item).setValue("#faInc", item.int & 1); // organica afectada
		}
		const fnSource = term => {
			const url = presto.isGcr() ? "/uae/presto/organicas/inc/gcr" : "/uae/presto/organicas/inc"; // url by type
			api.init().json(url, { ej: this.getval("#ejInc"), term }).then(this.#acOrgInc.render); // send fetch
		}
		const fnReset = () => { this.setValue("#faInc").setValue("#impInc"); this.#ecoInc.reset(); }
		this.#acOrgInc.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelect).setReset(fnReset);

		this.#ecoInc.setEmptyOption("Seleccione una económica");
		const fnEditableEjInc = () => (partidas.isEmpty() && !presto.isDisableEjInc());
		this.set("is-editable-ej-dec", partidas.isEmpty).set("is-editable-ej-inc", fnEditableEjInc).onChangeInput("#ejInc", this.#acOrgInc.reload);

		tabs.setAction("partida-inc-add", () => {
			if (!valid.partidaInc()) return; // errores al validar los campos de entrada
			const url = `/uae/presto/partida/add?org=${this.#acOrgInc.getValue()}&eco=${this.#ecoInc.getValue()}`;
			api.init().json(url).then(partidaInc => { // fetch partida a incrementar
				if (!valid.partidaSrv(partidaInc)) return; // error en la partida a incrementar
				partidaInc.imp030 = partidaInc.imp = this.valueOf("#impInc"); // Importe de la partida a añadir
				partidas.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
				this.#acOrgInc.reload(); // reseteo los valores del formulario
			});
		});
		tabs.setAction("save030", () => {
			if (!valid.validate030()) // validate partida 080 / 030
				return false; // not valid data
			if (presto.isEditable()) // if editable => back to presto view, send table on tab-action-send
				return tabs.backTab().showOk("Datos del documento 030 asociados correctamente.");
			api.setJSON(partidas.getData()).json("/uae/presto/save/030").then(tabs.showForm);
		});
	}

	autoload = (partida, imp) => {
		partida = partida || partidas.getFirst();
		if (!partida) // compruebo si existe partida a incrementar
			return !this.showError("No se ha seleccionado una partida a incrementar");
		partida.imp = imp || 0; //propone un importe
		partidas.render([ partida ]); //render partida unica
		this.setValue("#impDec", partida.imp);
		p030.autoload(partida, imp);
	}

	view = data => {
		this.#ecoInc.reset(); // clear select box
		partidas.render(data); // load table
	}
}

export default new PartidaInc();
