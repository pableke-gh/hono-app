
import sb from "../../../components/types/StringBox.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/rutas.js";

import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import dietas from "../../model/Dietas.js";

import AutocompleteMaps from "../inputs/Autocomplete.js";
import AddRuta from "../inputs/AddRuta.js";
import TableRutas from "../tables/rutas.js";
import place from "../../util/place.js";
import form from "../irse.js";

class Rutas {
	#tRutas = tabs.$1(2, "table");

	init = () => {
		this.#tRutas.init(); // init. itinerario
		const fnBlur = (ev, f1, f2) => { f2.value = ev.target.value; f1.removeAttribute("max"); f2.removeAttribute("max"); }
		form.getInput("#f1.ui-ruta").setRange("f2", fnBlur);
		form.getElement("matricula").addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);
			irse.setMatricula(ev.target.value);
		});

		const fnSend = () => {
			const matricula = form.getValue("matricula");
			const tipo = form.getOrganicas().getTipoDieta();
			const grupo = form.getPaso1().getGrupoDieta();
			// recalculo las nuevas dietas y las envio al servidor, el response actualiza la vista (pasos 2, 5 y 6 resumen)
			const data = { id: irse.getId(), matricula, rutas: rutas.getRutas(), dietas: dietas.build(tipo, grupo) };
			return api.setJSON(data).json("/uae/iris/rutas/save"); // send data to server and return promise
		}
		const fnUpdate = data => { // subtablas
			this.view(data.rutas); // load pk from db
			form.setChanged().getPaso5().updateRutas(); // rutas de consulta y pendientes
			form.getResumen().updateRutas(data.dietas); // km y dietas
		}

		tabs.setInitEvent(2, place.setScript); // load google api maps once
		tabs.getTab(2).addEventListener("change", ev => ev.stopPropagation()); // inputs not change form state => only programmatically
		tabs.setViewEvent(2, () => form.setValue("matricula", irse.getMatricula())); // preload matricula from server

		tabs.setBackEvent(2, () => {
			if (valid.itinerario() && irse.isEditable() && form.isChanged()) // is valid change
				fnSend().then(fnUpdate); // send data to server and go back
		});
		tabs.setAction("paso2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!irse.isEditable() || !form.isChanged()) return tabs.next(); // go next tab directly
			fnSend().then(data => { fnUpdate(data); tabs.goTo(); }); // go next tab with messages
		});
		tabs.setAction("save2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!form.isChanged()) return form.setOk(); // nada que guardar
			fnSend().then(fnUpdate); // send data to server
		});
	}

	getRutas = () => this.#tRutas; // table rutas
	rebuild() { this.#tRutas.render(); } // reload table
	view(data) { rutas.setRutas(data); this.#tRutas.render(); }
}

customElements.define("autocomplete-maps", AutocompleteMaps, { extends: "input" });
customElements.define("add-ruta", AddRuta, { extends: "a" });
customElements.define("table-rutas", TableRutas, { extends: "table" });

export default new Rutas();
