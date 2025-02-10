
import coll from "../../components/CollectionHTML.js";
import dt from "../../components/DateBox.js";
import nb from "../../components/NumberBox.js";
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";
import dom from "../../lib/uae/dom-box.js";

import perfil from "./perfil.js";
import organicas from "./organicas.js";

function IrseRutas() {
	const self = this; //self instance
	//const CT_LAT = 37.62568269999999;
	//const CT_LNG = -0.9965839000000187;
	const CT_NAME = "Cartagena, España";
	const MIN_DATE = dt.clone().addDays(-365); //1 año antes
	const MAX_DATE = dt.clone().addDays(180); //6 meses despues

	const MUN = { //default ruta MUN
		desp: 1, mask: 1, // VP y principal 
		pais1: "ES", pais2: "ES"
	};
	const LOC = { //default ruta AUT/A7J
		desp: 10, mask: 1, // VP y principal 
		pais1: "ES", pais2: "ES"
	};
	const CT = { //default CT coords
		desp: 0, mask: 4, pais: "ES",
		origen: CT_NAME, pais1: "ES",
		destino: CT_NAME, pais2: "ES"
	};

	const resume = { sizeOut: 0, sizeVp: 0 };
	const STYLES = {
		remove: "removeRuta",
		f1: (val, ruta) => i18n.isoDate(ruta.dt1), h1: (val, ruta) => sb.isoTimeShort(ruta.dt1), 
		f2: (val, ruta) => i18n.isoDate(ruta.dt2), h2: (val, ruta) => sb.isoTimeShort(ruta.dt2),
		principal: (val, ruta) => (ruta.mask & 1) ? '<span class="text-warn icon"> <i class="fal fa-flag-checkered"></i></span>' : "",
		km1: i18n.isoFloat, km2: i18n.isoFloat, totKm: i18n.isoFloat,
		impKm: (val, ruta) => fmtImpKm(ruta),
		totKm: i18n.isoFloat, totKmCalc: i18n.isoFloat, 
		desp: val => {
			let output = i18n.getItem("tiposDesp", val);
			if (val == 1)
				output += " (" + IRSE.matricula + ")";
			return output;
		}
	};

	var rutas, divData, bruto, elImpKm, justifiKm;

	const getLoc = () => perfil.isMun() ? MUN : LOC;
	const fmtImpKm = ruta => i18n.isoFloat(ruta.km1 * IRSE.gasolina);
	const fnSetMain = ruta => {
		rutas.forEach(ruta => { ruta.mask &= ~1; });
		ruta.mask |= 1;
	}

	//necesario para recalculo de dietas
	this.getImpKm = () => resume.impKm;
	this.getTotKm = () => resume.totKm;
	this.getTotKmCalc = () => resume.totKmCalc;

	this.getAll = () => rutas;
	this.getResume = () => resume;
	this.getStyles = () => STYLES;
	this.size = () => coll.size(rutas);
	this.empty = () => coll.empty(rutas);
	this.first = () => rutas[0];
	this.last = () => coll.last(rutas);
	this.start = () => (self.size() && sb.toDate(self.first().dt1));
	this.end = () => (self.size() && sb.toDate(self.last().dt2));
	this.getNumRutasVp = () => resume.sizeVp;
	this.getNumRutasOut = () => resume.sizeOut;

	this.valid = function(ruta) {
		dom.closeAlerts();
		if (!ruta.origen)
			dom.addError("#origen", "errOrigen", "errRequired");
		if (ruta.desp == 1)
			dom.required("#matricula", "errMatricula");
		if (!dt.inRange(new Date(ruta.dt1), MIN_DATE, MAX_DATE))
			return dom.addError("#f1", "errFechasRuta").isOk();
		if (ruta.dt1 > ruta.dt2)
			return dom.addError("#f1", "errFechasOrden").isOk();
		return dom.isOk();
	}
	this.validAll = function() {
		if (self.empty())
			return dom.closeAlerts().addError("#origen", "errItinerario").isOk();
		let r1 = rutas[0];
		if (!self.valid(r1))
			return false;
		for (let i = 1; i < rutas.length; i++) {
			let r2 = rutas[i];
			if (!self.valid(r2))
				return false; //stop
			if (!r1.pais2.startsWith(r2.pais1.substring(0, 2)))
				return dom.addError("#destino", "errItinerarioPaises").isOk();
			if (r1.dt2 > r2.dt1) //rutas ordenadas
				return dom.addError("#destino", "errItinerarioFechas").isOk();
			if (rutas[0].origen == r2.origen)
				return dom.addError("#destino", "errMulticomision").isOk();
			r1 = r2; //go next route
		}
		return dom.isOk();
	}

	const isValidObjeto = () => dom.closeAlerts().required("#objeto", "errObjeto").isOk();
	this.paso1 = () => isValidObjeto() && loading();
	this.paso1Col = () => isValidObjeto() && dom.past("#fAct", "errDateLe").gt0("#impAc", "errGt0").isOk();
	this.validItinerario = function() {
		if (isValidObjeto() && self.validAll()) {
			let numPrincipales = 0;
			rutas.forEach(ruta => { numPrincipales += ruta.mask & 1; });
			return (numPrincipales == 1) || dom.addError("#destino", "errMainRuta").isOk();
		}
		return false;
	}

	this.add = function(ruta, dist) {
		ruta.temp = true;
		rutas.push(ruta);

		//reordeno rutas por fecha de salida
		rutas.sort((a, b) => sb.cmp(a.dt1, b.dt1));

		//calculo de la ruta principal
		let diff = 0;
		let principal = rutas[0];
		for (let i = 1; i < rutas.length; i++) {
			let aux = sb.diffDate(rutas[i].dt1, rutas[i - 1].dt2);
			if (diff < aux) {
				diff = aux;
				principal = rutas[i - 1];
			}
		}

		if (self.validAll()) {
			delete ruta.temp;
			fnSetMain(principal);
			ruta.km1 = ruta.km2 = dist;
			IRSE.matricula = dom.getValue("#matricula"); //update from input
			dom.table("#rutas", rutas, resume, STYLES);
		}
		else
			rutas.remove(r => r.temp);
		return self;
	}

	this.paso2 = () => self.validItinerario()
					&& ((self.size() > 1) || dom.addError("#destino", "errMinRutas").isOk())
					&& loading();
	this.paso6 = () => {
		dom.closeAlerts();
		if (resume.justifi)
			dom.required("#justifiKm", "errJustifiKm");
		return dom.isOk() && loading();
	}

	function fnRecalc() {
		resume.totKm = resume.totKmCalc = 0;
		resume.vp.forEach(ruta => {
			resume.totKm += nb.round(ruta.km1);
			resume.totKmCalc += nb.round(ruta.km2);
		});
		resume.km1 = resume.totKm; //synonym
		resume.impKm = resume.totKm * IRSE.gasolina;
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;

		elImpKm.innerHTML = i18n.isoFloat(self.getImpKm()) + " €";
		bruto.innerHTML = organicas.getTotalFmt();
		justifiKm.setVisible(resume.justifi);
		return self;
	}

	this.init = form => {
		bruto = form.querySelector("#imp-bruto");
		divData = form.querySelector("#rutas-data");
		elImpKm = form.querySelector("#imp-km") || coll.getDivNull();
		justifiKm = form.querySelector(".justifi-km") || coll.getDivNull();
		rutas = coll.parse(divData.innerText) || []; // container

		function fnResume() {
			resume.out = rutas.filter(ruta => (ruta.desp != 1) && (ruta.desp != 3) && !ruta.g); //rutas no asociadas a factura
			resume.sizeOut = resume.out.length; // size table footer
			resume.vp = rutas.filter(ruta => (ruta.desp == 1)); //rutas en vp
			resume.sizeVp = resume.vp.length; // size table footer
	
			// Actualizo las tablas relacionadas
			dom.table("#rutas-out", resume.out, resume, STYLES).table("#vp", resume.vp, resume, STYLES);
			form.querySelectorAll(".rutas-vp").toggle("hide", self.getNumRutasVp() < 1); // show / hide rutas con vehiculo propio
			resume.size = rutas.length; // save global size
			return fnRecalc();
		}
		function fnSave() {
			const fnReplace = (key, value) => (((key == "p2") || key.endsWith("Option")) ? undefined : value); 
			divData.innerText = JSON.stringify(rutas, fnReplace); // not to save place
			form.setval("#etapas", divData.innerText); // load input value
		}

		fnResume(); // Actualizo rutas e importes
		if (perfil.isAutA7j() || perfil.is1Dia()) {
			const ruta = Object.assign({}, getLoc(), rutas[0]);
			rutas[0] = ruta; // Save new data (routes.length = 1)

			form.afterChange(ev => { fnResume(); fnSave(); }) // Any input change => save all rutas
				.setVisible(".grupo-matricula", ruta.desp == 1) // grupo asociado al vehiculo propio
				.setField("#origen", ruta.origen, ev => { ruta.origen = ruta.destino = ev.target.value; })
				.setField("#desp", ruta.desp, ev => { ruta.desp = +ev.target.value; })
				.setField("#dist", ruta.km1, ev => { ruta.km1 = ruta.km2 = i18n.toFloat(ev.target.value); })
				.setField("#f2", ruta.dt2, ev => { ruta.dt2 = sb.endDay(ev.target.value); })
				.setField("#f1", ruta.dt1, ev => {
					ruta.dt1 = ev.target.value;
					//si no hay f2 considero el dia completo de f1 => afecta a las validaciones
					ruta.dt2 = form.getInput("#f2") ? ruta.dt2 : sb.endDay(ruta.dt1);
				});
		}
		else {
			// Table Events handlers paso 2 y 6
			dom.onFindRow("#rutas", (table, ev) => {
				fnSetMain(ev.detail.data);
				dom.table("#rutas", rutas, resume, STYLES);
			}).onRenderTable("#rutas", table => {
				const last = fnResume().last(rutas) || CT;
				form.setval("#origen", last.destino).setval("#f1", sb.isoDate(last.dt2)).setval("#h1", sb.isoTimeShort(last.dt2))
					.setval("#destino").copy("#f2", "#f1").setval("#h2").setval("#principal", "0").setval("#desp")
					.delAttr("#f1", "max").delAttr("#f2", "min").hide(".grupo-matricula");
				if (!last.dt1)
					form.setFocus("#f1");
				else if (last.mask & 1) // es ruta principal?
					form.restart("#h1");
				else
					form.setFocus("#destino");
			});

			// tabla resumen de vehiculo propio del paso 6
			dom.onChangeTable("#vp", table => {
				const ruta = resume.data;
				resume.element.value = i18n.fmtFloat(resume.element.value);
				ruta.km1 = i18n.floatval(resume.element.value);

				fnRecalc(); fnSave();
				dom.tfoot(table, resume, STYLES);
				form.setText(resume.row.cells[9], fmtImpKm(ruta) + " €");
				resume.justifi && dom.setFocus("#justifiKm");
			});
		}

		//load rutas vp/out and autoload fechas del itinerario (paso 5 y 6)
		dom.table("#rutas", rutas, resume, STYLES) // render rutas
			.onRenderTable("#rutas", fnSave); // save after first render

		form.onChangeInput("#f1", ev => form.setval("#f2", ev.target.value)).setDateRange("#f1", "#f2") // Rango de fechas
			.onChangeInput("#desp", ev => form.setVisible(".grupo-matricula", ev.target.value == "1"))
			.onChangeInput("#matricula", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		return self;
	}
}

export default new IrseRutas();
