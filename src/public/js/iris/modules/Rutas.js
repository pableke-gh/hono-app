
import coll from "../../components/CollectionHTML.js";
import sb from "../../components/StringBox.js";
import tb from "../../components/TemporalBox.js";

import maps from "./maps.js";
import RutasTabs from "./RutasTabs.js";
import ruta from "../model/Ruta.js";
import i18n from "../../i18n/langs.js";
import { CT } from "../data/rutas.js";

export default function Rutas(form) {
	const self = this; //self instance
	const perfil = form.get("perfil");
	const rutasTabs = new RutasTabs(form.set("rutas", self));
	let _rutas, _tblRutas; // itinerario

	this.getRutas = () => _rutas;
	this.size = () => coll.size(_rutas);
	this.isEmpty = () => coll.isEmpty(_rutas);
	this.getSalida = () => _rutas[0]; // primera ruta
	this.getLlegada = () => _rutas.at(-1); // ultima ruta

	this.getPaisSalida = () => ruta.getPaisSalida(self.getSalida());
	this.salida = () => ruta.salida(self.getSalida());
	this.llegada = () => ruta.llegada(self.getLlegada());
	this.isLlegadaTemprana = () => ruta.isLlegadaTemprana(self.getLlegada());

	this.getRutasVeiculoPropio = () => _rutas.filter(ruta.isVehiculoPropio);
	this.getRutasSinGastos = () => _rutas.filter(data => (ruta.isAsociableGasto(data) && !data.g));

	this.getRuta = fecha => { // Ruta asociada a fecha
		if (!_rutas)
			return null; // itinerario vacio
		let current = rutas[0]; // Ruta de salida
		if (!fecha) return current; // ruta por defecto
		const fMax = fecha.add({ hours: 29 }); // 5h del dia siguiente
		_rutas.forEach(aux => { // rutas ordenadas por fecha
			// Ultima fecha de llegada mas proxima a fMax
			current = tb.lt(ruta.llegada(aux), fMax) ? aux : current;
		});
		return current;
	}
	this.getPaisPernocta = fecha => {
		const aux = self.getRuta(fecha);
		if (aux) { // itinerario no vacio
			const f2 = ruta.llegada(aux); // fecha de llegada
			return tb.lt(fecha, f2) ? ruta.getPaisPernocta(aux) : ruta.getPaisllegada(aux);
		}
		return "ES";
	}

	function validateItinerario(rutas) { 
		const valid = i18n.getValidators();
		if (coll.isEmpty(rutas))
			return valid.addError("origen", "errItinerario").isOk();
		let r1 = rutas[0];
		if (!ruta.valid(r1))
			return false; // salida erronea
		const origen = ruta.getOrigen(r1);
		for (let i = 1; i < rutas.length; i++) {
			const r2 = rutas[i];
			if (!ruta.validRutas(r1, r2))
				return false; //stop
			if (origen == r2.origen)
				return valid.addError("destino", "errMulticomision").isOk();
			r1 = r2; //go next route
		}
		return valid.isOk();
	}
	this.validateP1 = data => {
		const valid = i18n.getValidators();
		if (!data.objeto)
        	valid.addRequired("objeto", "errObjeto");
		return valid.isOk();
	}
	this.validateMun = data => {
		const ok = self.validateP1(data) && validateItinerario(_rutas);
		if (ok && form.get("saveRutas")) // compruebo si hay cambios y si las rutas son validas
			form.saveTable("#etapas", _tblRutas).set("saveRutas", false);
		return ok;
	}
	this.validate = data => {
		let ok = self.validateP1(data) && validateItinerario(_rutas);
		ok = (ok && (self.size() > 1)) ? ok : i18n.getValidators().addError("destino", "errMinRutas").isOk();
		if (ok && form.get("saveRutas")) { // compruebo si hay cambios y si las rutas son validas
			const fnReplace = (key, value) => (((key == "p2") || key.endsWith("Option")) ? undefined : value);
			form.saveTable("#etapas", _tblRutas, fnReplace).set("saveRutas", false); // guardo los cambios en las rutas
		}
		return ok;
	}

	const fnSetMain = data => {
		_rutas.forEach(ruta.setOrdinaria);
		ruta.setPrincipal(data);
		_tblRutas.render(_rutas); // dibuja la nueva tabla
	}

	function fnUpdateForm() {
		const last = _rutas.last() || CT;
		form.setval("#origen", last.destino).setval("#f1", sb.isoDate(last.dt2)).setval("#h1", sb.isoTimeShort(last.dt2))
			.setval("#destino").copy("#f2", "#f1").setval("#h2").setval("#principal", "0").setval("#desp")
			.delAttr("#f1", "max").delAttr("#f2", "min").hide(".grupo-matricula");
		if (!last.dt1)
			form.setFocus("#f1");
		else if (last.mask & 1) // es ruta principal?
			form.restart("#h1");
		else
			form.setFocus("#destino");
		form.set("render-rutas-read", true).set("render-rutas-vp", true);
	}
	function fnAfterRender(resume) {
		ruta.afterRender(resume);
		form.set("justifi", resume.justifi).set("saveRutas", true);
	}
	async function fnAddRuta(ev) {
		ev.preventDefault(); // stop event
		const data = form.validate(maps.validateFields);
		if (!data || !maps.validatePlaces(data, self) || !ruta.valid(data))
			return false; // maps validation error

		const temp = _rutas.concat(data);
		// reordeno todas las rutas por fecha de salida
		temp.sort((a, b) => sb.cmp(a.dt1, b.dt1));
		if (!validateItinerario(temp)) // check if all routes are valid
			return false; // no se agrega la nueva ruta
		if (ruta.isVehiculoPropio(data)) { // calcula distancia
			const dist = await maps.getDistance(data.origen, data.destino);
			data.km1 = data.km2 = dist; // actualiza las distancias
			if (!dist || i18n.getValidation().isError())
				return false; // invalid distance
		}

		_rutas = temp; // nuevo contenedor de rutas
		// calculo la ruta principal del itinerario
		let diff = 0; // diferencia en milisegundos
		let principal = self.getSalida(); // primera ruta
		for (let i = 1; i < _rutas.length; i++) { //itero el itinerario
			const aux = sb.diffDate(_rutas[i].dt1, _rutas[i - 1].dt2);
			if (diff < aux) { // ruta en la que paso mas tiempo
				diff = aux;
				principal = _rutas[i - 1];
			}
		}

		fnSetMain(principal); // recalculo cual es la ruta principal
		return form.set("updateDietas", true); // ruta agregada correctamente
	}

	this.init = () => {
		_rutas = coll.parse(form.getText("#rutas-data"));
		_tblRutas = form.setTable("#rutas");
		_tblRutas.setMsgEmpty("msgRutasEmpty")
				.set("#main", fnSetMain).setRemove(() => form.set("updateDietas", true))
				.setBeforeRender(ruta.beforeRender).setRender(ruta.row).setFooter(ruta.tfoot).render(_rutas)
				.setAfterRender(resume => { fnUpdateForm(); fnAfterRender(resume); });

		if (perfil.isRutaUnica())
			rutasTabs.mun();
		else {
			form.setClick("#add-ruta", fnAddRuta);
			fnUpdateForm();
		}

		form.onChangeInput("#f1", ev => form.setval("#f2", ev.target.value)).setDateRange("#f1", "#f2") // Rango de fechas
			.onChangeInput("#desp", ev => form.setVisible(".grupo-matricula", ev.target.value == "1"))
			.onChangeInput("#matricula", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		return self;
	}
}
