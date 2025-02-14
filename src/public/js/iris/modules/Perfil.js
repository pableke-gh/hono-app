
import coll from "../../components/Collection.js";
import sb from "../../components/StringBox.js";
import pf from "../../components/Primefaces.js";

import getActividad from "../data/actividades.js"
//import tribunales from "../data/irse/tribunales.js"

export default function Perfil(form) {
	const self = this; //self instance
	let _tblOrganicas; // table organicas

	this.getRol = () => form.getval("#rol");
	this.getActividad = () => form.getval("#actividad");
	this.isColaboracion = () => (self.getActividad() == "OCE") || (self.getActividad() == "IAE+OCE");
	this.isTribunal = () => (self.getActividad() == "ATR") || (self.getActividad() == "IAE+ATR");
	this.isFormacion = () => (self.getActividad() == "AFO") || (self.getActividad() == "IAE+AFO");
	this.isCom = () => (self.getActividad() == "COM");
	this.isMun = () => (self.getActividad() == "MUN");
	this.isMes = () => (self.getActividad() == "MES");
	this.isIae = () => (self.getActividad() == "IAE");
	this.isAtr = () => (self.getActividad() == "ATR");
	this.isAfo = () => (self.getActividad() == "AFO");
	this.isAcs = () => (self.getActividad() == "ACS");
	this.isCtp = () => (self.getActividad() == "CTP");
	this.isOce = () => (self.getActividad() == "OCE");
	this.isA7j = () => (self.getActividad() == "A7J");
	this.isMov = () => (self.getActividad() == "MOV");
	this.is1Dia = () => (self.isMun() || self.isMes() || self.isAcs() || self.isAfo() || self.isAtr() || self.isCtp() || self.isOce())

	this.getTramite = () => form.getval("#tramite");
	this.isAut = () => (self.getTramite() == "AUT");
	this.isAutA7j = () => (self.isAut() || self.isA7j());

	this.getColectivo = () => form.getText("#colectivo");
	this.setColectivo = val => { form.setText("#colectivo", val); return self; }

	//this.getTribunales = () => tribunales;
	//this.getTribunal = (name) => tribunales["at" + name] || 0;

	this.getFinanciacion = () => form.getval("#financiacion");
	this.isIsu = () => (self.getFinanciacion() == "ISU") || (self.getFinanciacion() == "xSU");
	this.isA83 = () => (self.getFinanciacion() == "A83") || (self.getFinanciacion() == "x83");
	this.isACA = () => (self.getFinanciacion() == "ACA") || (self.getFinanciacion() == "xAC");
	this.isOTR = () => (self.getFinanciacion() == "OTR") || (self.getFinanciacion() == "xOT");

	function fnCalcFinanciacion() {
		let result = "OTR"; //default fin.
		if (_tblOrganicas.size() > 0) {
			const ORG_300518 = "300518";
			_tblOrganicas.getData().forEach(org => {
				result = (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8)) ? "ISU" : result; //apli=642
				result = (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16) && (result != "ISU")) ? "A83" : result; //apli=643
				result = ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920")) && (result == "OTR")) ? "ACA" : result; //TTPP o Master
			});
			if (_tblOrganicas.size() > 1) {
				if (result == "ISU") return "xSU"; 
				if (result == "A83") return "x83"; 
				if (result == "ACA") return "xAC"; 
				return "xOT";
			}
		}
		return result;
	}
	function fnUpdatePerfil() {
		form.setStrval("#financiacion", fnCalcFinanciacion()) //recalculo la financiacion
			.select("#actividad", getActividad(self.getRol(), self.getColectivo(), self.getFinanciacion()))
			.select("#tramite", (self.isCom() || self.isMov()) ? 7 : 1) //default = AyL
			.hide(".fin-info").show(".fin-" + self.getFinanciacion());
		return self;
	}

	this.init = () => {
		_tblOrganicas = form.setTable("#organicas");
		_tblOrganicas.render(coll.parse(form.getText("#org-data")));

		const acInteresado = form.setAutocomplete("#interesado", {
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			minLength: 5, //reduce matches
			source: term => pf.sendTerm("rcFindInteresado", term),
			render: item => item.nif + " - " + item.nombre,
			select: item => {
				const email = item.email;
				const mailto = eCol.nextElementSibling.setVisible(email); // Show icon
				form.setAttribute(mailto, "href", "mailto:" + email); // update href
				self.setColectivo(item.ci).update(); //actualizo colectivo + tramite
				eCol.parentNode.show(); //muestro el colectivo
				return item.nif;
			},
			onReset: () => eCol.parentNode.hide()
		});
		const fnSource = term => pf.sendTerm("rcFindPersonal", term);
		form.setAcItems("#promotor", fnSource);
		form.setAcItems("#tribunal", fnSource);
		form.setAcItems("#mesa", fnSource);
		return fnUpdatePerfil();
	}
}
