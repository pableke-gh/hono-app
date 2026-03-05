
import Form from "../../../components/forms/Form.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";

import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import dietas from "../../model/Dietas.js";

import TableRutas from "../tables/rutas.js";
import maps from "../util/maps.js";
import form from "../irse.js";

export default class Rutas extends Form {
	#tr = new TableRutas(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	isChanged = () => this.get("table-changed"); // override
	setChanged = value => this.set("table-changed", value);

	init = () => {
		this.#tr.init();

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

		tabs.setInitEvent(2, maps);
		tabs.setViewEvent(2, () => { this.setValue("matricula", irse.getMatricula()); });

		tabs.setAction("paso2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged()) return tabs.nextTab(); // go next tab directly
			api.setJSON(fnData()).json("/uae/iris/rutas/save").then(data => { fnUpdate(data); tabs.goTab(); }); // go next tab with messages
		});
		tabs.setAction("save2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			api.setJSON(fnData()).json("/uae/iris/rutas/save").then(fnUpdate);
		});
	}

	view(data) {
		rutas.setRutas(data);
		this.#tr.render();
	}

	size = rutas.size;
	isEmpty = rutas.isEmpty;
	first = rutas.getSalida;
	last = rutas.getLlegada;
	getRutas = () => this.#tr;
	add(ruta, dist) {
		rutas.addRuta(ruta);
		if (valid.rutas()) {
			ruta.km1 = ruta.km2 = dist;
			rutas.setRutaPrincipal(rutas.findRutaPrincipal());
			this.#tr.render(); // render rutas paso 2 = maps
			return this;
		}
		const data = rutas.getRutas();
		data.spliece(data.indexOf(ruta), 1);
		return this;
	}
}
