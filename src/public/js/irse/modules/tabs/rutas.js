
import sb from "../../../components/types/StringBox.js";
import FormBase from "../../../components/forms/FormBase.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/rutas.js";

import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import dietas from "../../model/Dietas.js";

import TableRutas from "../tables/rutas.js";
import AutocompleteMaps from "../inputs/Autocomplete.js";
import AddRuta from "../inputs/AddRuta.js";
import place from "../../util/place.js";
import form from "../irse.js";

export default class Rutas extends FormBase {
	#tr = new TableRutas(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init = () => {
		this.#tr.init(); // tabla de rutas
		const fnBlur = (ev, f1, f2) => { f2.value = ev.target.value; f1.removeAttribute("max"); f2.removeAttribute("max"); }
		this.getInput("#f1.ui-ruta").setRange("f2", fnBlur);
		this.getElement("matricula").addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);
			irse.setMatricula(ev.target.value);
		});

		const fnData = () => {
			const matricula = form.getValue("matricula");
			const tipo = form.getOrganicas().getTipoDieta();
			const grupo = form.getPaso1().getGrupoDieta();
			// recalculo las nuevas dietas y las envio al servidor, el response actualiza la vista (pasos 2, 5 y 6 resumen)
			return { id: irse.getId(), matricula, rutas: rutas.getRutas(), dietas: dietas.build(tipo, grupo) };
		}
		const fnUpdate = data => { // subtablas
			this.setChanged().view(data.rutas); // load pk from db
			form.getPaso5().updateRutas(); // rutas de consulta y pendientes
			form.getResumen().updateRutas(data.dietas); // km y dietas
		}

		tabs.setInitEvent(2, place.setScript); // load google api maps once
		tabs.getTab(2).addEventListener("change", ev => ev.stopPropagation()); // inputs not change form state => only programmatically
		tabs.setViewEvent(2, () => this.setValue("matricula", irse.getMatricula())); // preload matricula from server

		tabs.setBackEvent(2, () => {
			if (valid.itinerario() && irse.isEditable() && this.isChanged()) // is valid change
				api.setJSON(fnData()).json("/uae/iris/rutas/save").then(fnUpdate); // save and go back
		});
		tabs.setAction("paso2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged()) return tabs.next(); // go next tab directly
			api.setJSON(fnData()).json("/uae/iris/rutas/save").then(data => { fnUpdate(data); tabs.goTo(); }); // go next tab with messages
		});
		tabs.setAction("save2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			api.setJSON(fnData()).json("/uae/iris/rutas/save").then(fnUpdate);
		});
	}

	getRutas = () => this.#tr; // table rutas
	rebuild() { this.#tr.render(); } // reload table
	view(data) { rutas.setRutas(data); this.#tr.render(); }
}

customElements.define("autocomplete-maps", AutocompleteMaps, { extends: "input" });
customElements.define("add-ruta", AddRuta, { extends: "a" });
