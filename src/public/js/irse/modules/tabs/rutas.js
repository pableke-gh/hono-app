
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

	init = () => {
		this.#tr.init();

		this.onChange("#desp", ev => this.setVisible(".grupo-matricula", ev.target.value == "1"));
		const fnBlur1 = (ev, f1, f2) => { f2.value = ev.target.value; f1.removeAttribute("max"); f2.removeAttribute("max"); }
		this.getInput("#f1.ui-ruta").setRange("f2", fnBlur1);

		const fnData = () => ({ // recalculo las nuevas dietas y las envio al servidor, el response actualiza la vista
			idses: irse.getId(), matricula: form.getValue("matricula"), rutas: rutas.getRutas(), 
			dietas: dietas.build(form.getOrganicas().getTipoDieta(), form.getPaso1().getGrupoDieta())
		});
		const fnUpdate = data => { // subtablas
			this.view(data.rutas); // load pk from db
			form.getPaso5().updateRutas(); // rutas de consulta y pendientes
			form.getResumen().updateRutas(data.dietas); // km y dietas
		}
		tabs.setInitEvent(2, maps);
		tabs.setAction("paso2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged())
				return tabs.nextTab(); // go next tab directly
			this.save(); window.rcPaso2(); // call server to save and calculate maps
			//api.setJSON(fnData()).json("/uae/iris/rutas/save").then(data => { fnUpdate(data); tabs.goTab(); }); // go next tab with messages
		});
		tabs.setAction("save2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			this.save(); window.rcSave2(); // call server to save and calculate maps
			//api.setJSON(fnData()).json("/uae/iris/rutas/save").then(fnUpdate);
		});

		window.rebuildDietas = () => api.setJSON(fnData()).json("/uae/iris/rutas/save").then(fnUpdate); // for debugging
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
		ruta.temp = true;
		rutas.addRuta(ruta);
		if (valid.rutas()) {
			delete ruta.temp;
			ruta.km1 = ruta.km2 = dist;
			rutas.setRutaPrincipal(rutas.findRutaPrincipal());
			this.#tr.render(); // render rutas paso 2 = maps
		}
		else
			rutas.getRutas().remove(r => r.temp);
		return this;
	}

	save = () => {
		if (rutas.isEmpty() || !this.isChanged())
			return loading(); // nada que guardar
		const fnReplace = (key, value) => ((key == "p2") ? undefined : value); // reduce size
		this.stringify("etapas", rutas.getRutas(), fnReplace); // load input value

		// recalculo las nuevas dietas y las envio al servidor, en el response se actualiza la vista
		const results = dietas.build(form.getOrganicas().getTipoDieta(), form.getPaso1().getGrupoDieta());
		form.stringify("gastos-dietas", results); // load input value
		return loading();
	}
}
