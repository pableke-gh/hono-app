
import coll from "../../components/CollectionHTML.js";
import nb from "../../components/types/NumberBox.js";
import sb from "../../components/types/StringBox.js";
import dom from "../lib/dom-box.js";
import i18n from "../i18n/langs.js";
import valid from "../i18n/validators.js";

import irse from "../model/Irse.js"
import ruta from "../model/ruta/Ruta.js"

import perfil from "./perfil.js";
import organicas from "./organicas.js";
import form from "../../xeco/modules/solicitud.js";

function IrseRutas() {
	const self = this; //self instance
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

	const fmtImpKm = ruta => i18n.isoFloat(ruta.km1 * IRSE.gasolina);
	const fnSetMain = data => { rutas.forEach(ruta.setOrdinaria); ruta.setPrincipal(data); }

	//necesario para recalculo de dietas
	this.getImpKm = () => resume.impKm;
	this.getTotKm = () => resume.totKm;
	this.totKmCalcFmt = () => resume.totKmCalc;

	this.getAll = () => rutas;
	this.size = () => coll.size(rutas);
	this.isEmpty = () => coll.isEmpty(rutas);
	this.first = () => rutas[0];
	this.last = () => coll.last(rutas);
	this.getHoraSalida = () => ruta.getHoraSalida(self.first());
	this.getHoraLlegada = () => ruta.getHoraLlegada(self.last());
	this.start = () => sb.toDate(self.getHoraSalida());
	this.end = () => sb.toDate(self.getHoraLlegada());
	this.getNumRutasVp = () => resume.sizeVp;
	this.getRutasOut = () => resume.out;

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

		if (valid.rutas(rutas)) {
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
	function fnResume() {
		resume.out = rutas.filter(ruta => (ruta.desp != 1) && (ruta.desp != 3) && !ruta.g); //rutas no asociadas a factura
		resume.sizeOut = resume.out.length; // size table footer
		resume.vp = rutas.filter(ruta => (ruta.desp == 1)); //rutas en vp
		resume.sizeVp = resume.vp.length; // size table footer
		resume.size = rutas.length; // save global size
		return fnRecalc(); // recalcula cabeceras
	}
	function fnSave() {
		const fnReplace = (key, value) => ((key == "p2") ? undefined : value); // reduce size
		divData.innerText = JSON.stringify(rutas, fnReplace); // not to save place
		form.setval("#etapas", divData.innerText); // load input value
		return self;
	}
	function fnSaveMun() {
		if (perfil.isMun()) {
			fnResume(); fnSave();
		}
		return loading();
	}
	function fnSaveMaps() {
		fnResume(); fnSave(); // recalcula todo
		return loading();
	}

	this.paso1 = () => (valid.mun(rutas) && fnSaveMun());
	//this.paso1Col = () => isValidObjeto() && dom.past("#fAct", "errDateLe").gt0("#impAc", "errGt0").isOk();
	this.paso2 = () => (valid.itinerario(rutas) && fnSaveMaps());
	this.paso6 = () => (valid.paso6(resume) && loading());

	this.mun = () => {
		if (!perfil.isMun()) return;
		const ruta = rutas[0] || { desp: 1 }; // mun = 1 ruta
		ruta.f1 = sb.isoDate(ruta.dt1); // input format date
		form.setValues(ruta, ".ui-mun").setVisible(".grupo-matricula", ruta.desp == 1);
	}
	this.init = () => {
		form.set("not-mun", () => !perfil.isMun()).set("is-rutas-gt-1", () => (self.size() > 1))
			.set("is-editable-rutas-gt-1", () => ((self.size() > 1) && irse.isEditable()))
			.set("getNumRutasVp", () => (!perfil.isEmpty() && self.getNumRutasVp()))
			.setChangeInput("#desp", ev => form.setVisible(".grupo-matricula", ev.target.value == "1"));
		const fnBlur1 = (ev, f1, f2) => { f2.value = ev.target.value; f1.removeAttribute("max"); f2.removeAttribute("max"); }
		form.setDateRange("#f1", "#f2", fnBlur1); // sincronizo fechas
		return self;
	}
	this.view = () => {
		bruto = form.querySelector("#imp-bruto");
		divData = form.querySelector("#rutas-data");
		elImpKm = form.querySelector("#imp-km") || coll.getDivNull();
		justifiKm = form.querySelector(".justifi-km") || coll.getDivNull();
		rutas = coll.parse(divData.innerText) || []; // container

		const CT = { desp: 0, mask: 4 }; //default CT
		CT.origen = CT.destino = "Cartagena, España";
		CT.pais = CT.pais1 = CT.pais2 = "ES";

		// Render rutas paso 2 = maps
		dom.onFindRow("#rutas", (table, ev) => {
			fnSetMain(ev.detail.data);
			dom.table("#rutas", rutas, resume, STYLES);
		}).onRenderTable("#rutas", table => {
			const last = fnResume().last(rutas) || CT;
			const matricula = form.getval("#matricula");
			form.setData({ origen: last.destino, f1: last.dt2, h1: last.dt2, f2: last.dt2, matricula }, ".ui-ruta")
				.restart("#destino").hide(".grupo-matricula");
			if (!last.dt1) // primera ruta?
				form.setFocus("#f1");
		}).table("#rutas", rutas, resume, STYLES);

		// tabla resumen de vehiculo propio paso 6
		dom.table("#vp", resume.vp, resume, STYLES);
		dom.onChangeTable("#vp", table => { // set event after render
			const ruta = resume.data;
			resume.element.value = i18n.fmtFloat(resume.element.value);
			ruta.km1 = i18n.floatval(resume.element.value);

			fnRecalc(); fnSave();
			dom.tfoot(table, resume, STYLES);
			form.setText(resume.row.cells[9], fmtImpKm(ruta) + " €");
			resume.justifi && dom.setFocus("#justifiKm");
		});

		// eventos del formulario para la ruta
		form.onChangeInput("#matricula", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
	}
}

export default new IrseRutas();
