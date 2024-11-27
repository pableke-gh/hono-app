
import coll from "../../../components/CollectionHTML.js";
import sb from "../../../components/StringBox.js";
import pf from "../../../components/Primefaces.js";
import i18n from "../../../i18n/langs.js";
import dom from "../../../lib/uae/dom-box.js";

import actividades from "../../../data/irse/actividades.js"
//import tribunales from "../../../data/irse/tribunales.js"

function IrsePerfil() {
	const self = this; //self instance
	const ACTIVIDAD = 0b0000000000011; //default = COM/MUN 

	const resume = {};
	const STYLES = { remove: "removeOrg", imp: i18n.isoFloat, resp: sb.lopd, fCache: i18n.isoDate };

	let eRol, eCol, eFin, eAct, eTramit;
	let organicas, current;

	this.getRol = () => eRol.value;
	this.isColaboracion = () => (eAct.value == "OCE") || (eAct.value == "IAE+OCE");
	this.isTribunal = () => (eAct.value == "ATR") || (eAct.value == "IAE+ATR");
	this.isFormacion = () => (eAct.value == "AFO") || (eAct.value == "IAE+AFO");
	this.isCom = () => (eAct.value == "COM");
	this.isMun = () => (eAct.value == "MUN");
	this.isMes = () => (eAct.value == "MES");
	this.isIae = () => (eAct.value == "IAE");
	this.isAtr = () => (eAct.value == "ATR");
	this.isAfo = () => (eAct.value == "AFO");
	this.isAcs = () => (eAct.value == "ACS");
	this.isCtp = () => (eAct.value == "CTP");
	this.isOce = () => (eAct.value == "OCE");
	this.isA7j = () => (eAct.value == "A7J");
	this.isMov = () => (eAct.value == "MOV");
	this.is1Dia = () => (self.isMun() || self.isMes() || self.isAcs() || self.isAfo() || self.isAtr() || self.isCtp() || self.isOce())

	this.isAut = () => (eTramit.value == "AUT");
	this.isAutA7j = () => (self.isAut() || self.isA7j());

	//this.getTribunales = () => tribunales;
	//this.getTribunal = (name) => tribunales["at" + name] || 0;

	function fnCalcFinanciacion() {
		let result = "OTR"; //default fin.
		if (coll.size(organicas) > 0) {
			const ORG_300518 = "300518";
			organicas.forEach(org => {
				result = (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8)) ? "ISU" : result; //apli=642
				result = (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16) && (result != "ISU")) ? "A83" : result; //apli=643
				result = ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920")) && (result == "OTR")) ? "ACA" : result; //TTPP o Master
			});
			if (organicas.length > 1) {
				if (result == "ISU") return "xSU"; 
				if (result == "A83") return "x83"; 
				if (result == "ACA") return "xAC"; 
				return "xOT";
			}
		}
		return result;
	}
	this.getFinanciacion = () => eFin.value;
	this.isIsu = () => (eFin.value == "ISU") || (eFin.value == "xSU");
	this.isA83 = () => (eFin.value == "A83") || (eFin.value == "x83");
	this.isACA = () => (eFin.value == "ACA") || (eFin.value == "xAC");
	this.isOTR = () => (eFin.value == "OTR") || (eFin.value == "xOT");

	function fnUpdatePerfil() {
		eFin.value = fnCalcFinanciacion(); //recalculo la financiacion
		dom.select(eAct, actividades[eRol.value + "," + eCol.innerText + "," + eFin.value] || ACTIVIDAD)
			.select(eTramit, (self.isCom() || self.isMov()) ? 7 : 1) //default = AyL
			.hide(".fin-info").show(".fin-" + eFin.value);
		return self;
	}

	//auto-start => update perfil
	this.update = fnUpdatePerfil;
	this.getColectivo = () => eCol.innerText;
	this.setColectivo = val => { eCol.innerText = val; return self; }

	this.getOrganicas = () => organicas;
	this.empty = () => coll.empty(organicas);
	this.getNumOrganicas = () => coll.size(organicas);
	this.isMultiorganica = () => coll.size(organicas) > 1;
	this.getOrganica = id => organicas.find(org => org.id == id); //get organica by id
	this.isInve3005 = org => (org && sb.starts(org.o, "3005") && ((org.mask & 64) == 64)); //es de investigacion de la 3005XX
	this.is643 = org => (org && ((org.mask & 16) == 16)); //contiene alguna aplicacion 643?
	this.addOrganica = () => {
		if (current && !organicas.find(org => org.id==current.id))
			organicas.push(current);
		dom.table("#organicas", organicas, resume, STYLES);
	}

	this.valid = () => {
		dom.closeAlerts().required("#perfil-financiacion", "errPerfil");
		self.empty(organicas) && dom.required("#organica", "errOrganicas");
		return dom.required("#tramitador", "errPerfil").required("#interesado", "errPerfil").isOk();
	}

	this.init = form => {
		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => coll.dom.copyToClipboard(url));

		eRol = form.getInput("#rol");
		eCol = form.querySelector("#colectivo");
		eFin = form.getInput("#financiacion");
		eAct = form.getInput("#actividad");
		eTramit = form.getInput("#tramite");

		form.afterReset(() => {
			coll.reset(organicas);
			i18n.set("imp", "");
			eCol.parentNode.hide();
			dom.table("#organicas", organicas, resume, STYLES);
			form.querySelector(".msg-cd").hide();
			fnUpdatePerfil();
		});

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

		function fnSave() {
			current = null; //remove selected
			fnUpdatePerfil(); //set new perfil
			form.setval("#presupuesto", JSON.stringify(organicas));
		}
		form.setAutocomplete("#organica", {
			minLength: 4,
			source: term => pf.sendTerm("rcFindOrg", term),
			render: item => item.o + " - " + item.dOrg,
			select: item => {
				current = item;
				i18n.set("imp", current.imp); //credito disponible
				if (!IRSE.uxxiec) {
					coll.reset(organicas).push(current);
					fnSave();
				}
				form.querySelector(".msg-cd").render().show();
				return item.id;
			},
			onReset: () => { i18n.set("imp", null); form.hide(".msg-cd"); }
		});

		organicas = coll.parse(form.getText("#org-data")) || [];
		const impCd = organicas[0]?.imp;
		i18n.set("imp", impCd); //importe precargado

		// Register events after render table => avoid first render
		dom.table("#organicas", organicas, resume, STYLES);
		dom.onRenderTable("#organicas", table => {
			fnSave(); //set new perfil
			form.setVisible("#add-org", !organicas.length).closeAlerts().setval("#organica");
		});

		fnUpdatePerfil(); // show first perfil for update
		eCol.parentNode.setVisible(acInteresado.isLoaded()); //muestro el colectivo
		eRol.addEventListener("change", fnUpdatePerfil);
		eAct.addEventListener("change", fnUpdatePerfil);
		form.querySelector(".msg-cd")?.render().setVisible(impCd);
		return self;
	}
}

export default new IrsePerfil();
