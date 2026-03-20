
import sb from "../../../components/types/StringBox.js";
import FormBase from "../../../components/forms/FormBase.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";
import result from "../../../core/util/Result.js";

import maps from "../../services/maps.js";
import irse from "../../model/Irse.js";
import rutas from "../../model/Rutas.js";
import dietas from "../../model/Dietas.js";

import TableRutas from "../tables/rutas.js";
import AutocompleteMaps from "../inputs/Autocomplete.js";
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

		tabs.setAction("addRuta", async () => {
			const ruta = valid.addRuta(); // form data
			if (!ruta) return false; // invalid inputs

			const origen = form.getInput("#origen"); // ojo! existen 2 campos origen
			const destino = form.getInput("#destino"); // por ahora solo 1 destino!
			var p1 = await origen.getPlace(); // get place with address components
			var p2 = await destino.getPlace(); // get place with address components
			const loadOrigen = (place, pais, mask) => {
				p1 = place;
				ruta.pais1 = pais;
				ruta.mask = mask;
			}

			if (!p1 && rutas.isEmpty()) // primera ruta
				loadOrigen(place.getPlaceCT(), place.getDefaultCountry(), place.getDefaultMask());
			else if (p1) // ha seleccionado un origen?
				loadOrigen(p1, place.getCountry(p1), place.isCartagena(p1) ? 4 : 0);
			else if (rutas.size() > 0) { //origen = destino anterior
				const last = rutas.getLlegada(); // ultima ruta
				if (!last.p2) // tiene el destino?
					last.p2 = (await result.catch(maps.getPlaces(last.destino))).isOk() ? result.getData()[0] : null;
				loadOrigen(last.p2, last.pais2, last.mask);
			}

			p2 || valid.addRequired("destino", "errDestino"); //ha seleccionado un destino
			p1 || valid.addRequired("origen", "errOrigen"); //ha seleccionado un origen
			if (p1 && p2 && place.isSameLocality(p1, p2)) // is same place?
				valid.addRequired("destino", "errItinerarioCiudad");
			if (valid.isError()) return valid.fail(); // places validator

			ruta.p2 = p2; // current destination place
			ruta.dt1 = sb.toIsoDate(ruta.f1, ruta.h1);
			ruta.dt2 = sb.toIsoDate(ruta.f2, ruta.h2);
			ruta.pais2 = place.getCountry(p2);
			ruta.mask = ((ruta.mask & 4) && place.isCartagena(p2)) ? 4 : 0;

			if (!valid.ruta(ruta)) // extra validations
				return false;
			if (ruta.desp != "1") // no calculate distance
				return this.add(ruta, null);

			await result.catch(maps.getDistance(origen.getLabel(), destino.getLabel()));
			if (result.isError()) return result.error(); // error al calcular la distancia
			this.add(ruta, result.getData()); // distance in km
		});

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

	getRutas = () => this.#tr;
	add(ruta, dist) {
		rutas.addRuta(ruta, dist);
		if (!valid.rutas())
			return rutas.remove(ruta);
		rutas.setRutaPrincipal(rutas.findRutaPrincipal());
		this.#tr.render(); // render rutas paso 2 = maps
		this.setChanged(true); // update indicator
	}
}

customElements.define("autocomplete-maps", AutocompleteMaps, { extends: "input" });
