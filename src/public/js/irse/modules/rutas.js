
import api from "../../core/components/Api.js";
import Tab from "../../core/components/tabs/Tab.js";
import valid from "../i18n/validators/rutas.js";

import irse from "../model/Irse.js";
import rutas from "../model/Rutas.js";
import dietas from "../model/Dietas.js";

import AutocompleteMaps from "../components/rutas/Autocomplete.js";
import Transportes from "../components/rutas/Transportes.js";
import AddRuta from "../components/rutas/AddRuta.js";
import SaveRutas from "../components/rutas/SaveRutas.js";
import tables from "../components/tables/tables.js";

import place from "../util/place.js";
import form from "./irse.js";

export default class Rutas extends Tab {
	getRutas = () => tables.get("rutas"); // get table rutas

	init() {
		super.init(); // init. tab rutas
		place.setScript(); // load google api maps once
		this.addEventListener("change", ev => ev.stopPropagation()); // inputs not change state form => only programmatically
		const fnBlur = (ev, f1, f2) => { f2.value = ev.target.value; f1.removeAttribute("max"); f2.removeAttribute("max"); }
		form.getInput("#f1.ui-ruta").setRange("f2", fnBlur);
	}
	afterView() {
		form.getElement("origen").focus(); // focus on first input
	}

	view() { // render table rutas
		this.getRutas().render();
	}

	send() {
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
	prev1() {
		if (valid.itinerario() && irse.isEditable() && form.isChanged()) // is valid change
			this.send(); // send data to server and go back
		super.prev1(); // go back tab
	}
	next1() {
		if (!valid.itinerario()) return; // if error => stop
		const tab = irse.isIsu() ? 3 : 5; // destination tab
		if (!irse.isEditable() || !form.isChanged())
			return this.show(tab); // go next tab directly
		// go next tab with alerts messages
		this.send().then(() => this.show(tab));
	}
}

customElements.define("autocomplete-maps", AutocompleteMaps, { extends: "input" });
customElements.define("desp-ruta", Transportes, { extends: "select" });
customElements.define("add-ruta", AddRuta, { extends: "button" });
customElements.define("save-rutas", SaveRutas, { extends: "button" });
