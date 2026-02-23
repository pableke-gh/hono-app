
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";

import irse from "../../model/Irse.js"
import rutas from "../../model/Rutas.js"

import TableRutas from "../tables/rutas.js";
import maps from "../util/maps.js";
import form from "../irse.js"

export default class Rutas extends Form {
	#tr = new TableRutas(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init = () => {
		this.#tr.init();

		this.setChangeInput("#desp", ev => this.setVisible(".grupo-matricula", ev.target.value == "1"));
		const fnBlur1 = (ev, f1, f2) => { f2.value = ev.target.value; f1.removeAttribute("max"); f2.removeAttribute("max"); }
		this.setDateRange("#f1", "#f2", fnBlur1); // sincronizo fechas

		tabs.setInitEvent(2, maps);
		tabs.setAction("paso2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged())
				return tabs.nextTab(); // go next tab directly
			this.save(); window.rcPaso2(); // call server to save and calculate maps
		});
		tabs.setAction("save2", () => {
			if (!valid.itinerario()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			this.save(); window.rcSave2(); // call server to save and calculate maps
		});
		return this;
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
		this.stringify("#etapas", rutas.getRutas(), fnReplace); // load input value
		form.getResumen().getKilometraje().render(); // tabla resumen de vehiculo propio paso 6
		return loading();
	}
}
