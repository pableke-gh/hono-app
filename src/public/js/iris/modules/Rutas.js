
import coll from "../../components/CollectionHTML.js";
import sb from "../../components/StringBox.js";
import tb from "../../components/TemporalBox.js";

import iris from "./iris.js";
import perfil from "./perfil.js";
import maps from "./maps.js";
import rtabs from "./rutasTabs.js";
import dietas from "./dietas.js";
import ruta from "../model/Ruta.js";
import i18n from "../../i18n/langs.js";
import { CT } from "../data/rutas.js";

function Rutas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblRutas; // itinerario

	this.getRutas = rtabs.getRutas;
	this.size = rtabs.size;
	this.isEmpty = rtabs.isEmpty;

	this.getPaisSalida = () => ruta.getPaisSalida(rtabs.getSalida());
	this.salida = () => ruta.salida(rtabs.getSalida());
	this.llegada = () => ruta.llegada(rtabs.getLlegada());
	this.isLlegadaTemprana = () => ruta.isLlegadaTemprana(rtabs.getLlegada());

	this.getRuta = fecha => { // Ruta asociada a fecha
		if (rtabs.isEmpty())
			return null; // itinerario vacio
		let current = rutas[0]; // Ruta de salida
		if (!fecha) return current; // ruta por defecto
		const fMax = fecha.add({ hours: 29 }); // 5h del dia siguiente
		rtabs.getRutas().forEach(aux => { // rutas ordenadas por fecha
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
        	valid.addRequired("objeto-temp", "errObjeto");
		return valid.isOk();
	}
	this.validateMun = data => {
		const ok = self.validateP1(data) && validateItinerario(rtabs.getRutas());
		if (ok && form.get("saveRutas")) // compruebo si hay cambios y si las rutas son validas
			form.saveTable("#rutas-json", _tblRutas).set("saveRutas", false);
		return ok;
	}
	this.validate = data => {
		let ok = self.validateP1(data) && validateItinerario(rtabs.getRutas());
		ok = (ok && (self.size() > 1)) ? ok : i18n.getValidators().addError("destino", "errMinRutas").isOk();
		if (ok && form.get("saveRutas")) { // compruebo si hay cambios y si las rutas son validas
			const fnReplace = (key, value) => (((key == "p2") || key.endsWith("Option")) ? undefined : value);
			form.saveTable("#rutas-json", _tblRutas, fnReplace).set("saveRutas", false); // guardo los cambios en las rutas
		}
		if (ok && dietas.isUpdateDietas())
			dietas.build(); // recalculo las dietas
		return ok;
	}
	window.validateP1 = () => form.validate(self.validateP1);
	window.validateMun = () => form.validate(self.validateMun);
	window.validateP2 = () => form.validate(self.validate);

	const fnSetMain = data => {
		rtabs.setRutaPrincipal(data); // recalculo la ruta principal
		_tblRutas.render(rtabs.getRutas()); // dibuja la nueva tabla
	}

	function fnUpdateForm() {
		const last = rtabs.getLlegada() || CT;
		form.setval("#origen", last.destino).setval("#f1", sb.isoDate(last.dt2)).setval("#h1", sb.isoTimeShort(last.dt2))
			.setval("#destino").copy("#f2", "#f1").setval("#h2").setval("#principal", "0").setval("#desp")
			.delAttr("#f1", "max").delAttr("#f2", "min").hide(".grupo-matricula");
		if (!last.dt1)
			form.setFocus("#f1");
		else if (last.mask & 1) // es ruta principal?
			form.restart("#h1");
		else
			form.setFocus("#destino");
		rtabs.setRenderRutasRead().setRenderRutasVp();
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

		const temp = rtabs.getRutas().concat(data);
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

		// nuevo contenedor de rutas + recalculo de la ruta principal
		fnSetMain(rtabs.setRutas(temp).getRutaPrincipal());
		return dietas.setUpdateDietas(); // ruta agregada correctamente
	}

	this.init = () => {
		rtabs.init();
		_tblRutas = form.setTable("#tbl-rutas");
		_tblRutas.setMsgEmpty("msgRutasEmpty")
				.set("#main", fnSetMain).setRemove(dietas.setUpdateDietas) 
				.setBeforeRender(ruta.beforeRender).setRender(ruta.row).setFooter(ruta.tfoot).render(rtabs.getRutas())
				.setAfterRender(resume => { fnUpdateForm(); fnAfterRender(resume); });

		if (perfil.isRutaUnica())
			rtabs.mun();
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

export default new Rutas();
