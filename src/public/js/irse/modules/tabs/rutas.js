
import sb from "../../../components/types/StringBox.js";
import api from "../../../core/components/Api.js";
import tabs from "../../../core/components/tabs/TabsOld.js";

import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import dietas from "../../model/Dietas.js";

import AutocompleteMaps from "../../components/rutas/Autocomplete.js";
import AddRuta from "../../components/rutas/AddRuta.js";
import TableRutas from "../tables/rutas.js";
import PrevRutas from "../../components/rutas/PrevRutas.js";
import NextRutas from "../../components/rutas/NextRutas.js";
import SaveRutas from "../../components/rutas/SaveRutas.js";

import place from "../../util/place.js";
import form from "../irse.js";

class Rutas {
	#tRutas = tabs.$1(2, "table");

	init() {
		this.#tRutas.init(); // init. itinerario
		const fnBlur = (ev, f1, f2) => { f2.value = ev.target.value; f1.removeAttribute("max"); f2.removeAttribute("max"); }
		form.getInput("#f1.ui-ruta").setRange("f2", fnBlur);
		form.getElement("matricula").addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);
			irse.setMatricula(ev.target.value);
		});

		tabs.setInitEvent(2, place.setScript); // load google api maps once
		tabs.getTab(2).addEventListener("change", ev => ev.stopPropagation()); // inputs not change form state => only programmatically
		//tabs.setViewEvent(2, () => form.setValue("matricula", irse.getMatricula())); // preload matricula from server
	}

	getRutas = () => this.#tRutas; // get table rutas
	view() { this.#tRutas.render(); } // set table rutas
	save() {
		const matricula = form.getValue("matricula");
		const tipo = form.getOrganicas().getTipoDieta();
		const grupo = form.getPaso1().getGrupoDieta();
		// recalculo las nuevas dietas y las envio al servidor, el response actualiza la vista (pasos 2, 5 y 6 resumen)
		const data = { id: irse.getId(), matricula, rutas: rutas.getRutas(), dietas: dietas.build(tipo, grupo) };
		return api.setJSON(data).json("/uae/iris/rutas/save").then(data => { // send data to server and return promise
			rutas.setRutas(data.rutas); // update rutas id's with db response
			this.view(); // re-load pk from db
			form.setChanged().getPaso5().updateRutas(); // rutas de consulta y pendientes
			form.getResumen().updateRutas(data.dietas); // km y dietas del paso resumen
		});
	}
}

customElements.define("autocomplete-maps", AutocompleteMaps, { extends: "input" });
customElements.define("add-ruta", AddRuta, { extends: "button" });
customElements.define("table-rutas", TableRutas, { extends: "table" });
customElements.define("prev-rutas", PrevRutas, { extends: "button" });
customElements.define("next-rutas", NextRutas, { extends: "button" });
customElements.define("save-rutas", SaveRutas, { extends: "button" });

export default new Rutas();
