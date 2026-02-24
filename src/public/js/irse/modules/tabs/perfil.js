
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators.js";

import irse from "../../model/Irse.js";
import Organicas from "../tables/organicas.js";
import getActividad from "../../data/perfiles/actividades.js";

export default class Perfil extends Form {
	#organicas = new Organicas(this);
	#eRol; #eCol; #eFin; #eAct; #eTramit;
	#acInteresado; #acOrganica;

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	getRol = () => this.#eRol.value;
	isColaboracion = () => (this.#eAct.value == "OCE") || (this.#eAct.value == "IAE+OCE");
	isTribunal = () => (this.#eAct.value == "ATR") || (this.#eAct.value == "IAE+ATR");
	isFormacion = () => (this.#eAct.value == "AFO") || (this.#eAct.value == "IAE+AFO");
	isCom = () => (this.#eAct.value == "COM");
	isMun = () => (this.#eAct.value == "MUN");
	isMes = () => (this.#eAct.value == "MES");
	isIae = () => (this.#eAct.value == "IAE");
	isAtr = () => (this.#eAct.value == "ATR");
	isAfo = () => (this.#eAct.value == "AFO");
	isAcs = () => (this.#eAct.value == "ACS");
	isCtp = () => (this.#eAct.value == "CTP");
	isOce = () => (this.#eAct.value == "OCE");
	isA7j = () => (this.#eAct.value == "A7J");
	isMov = () => (this.#eAct.value == "MOV");
	is1Dia = () => (this.isMun() || this.isMes() || this.isAcs() || this.isAfo() || this.isAtr() || this.isCtp() || this.isOce())

	getTramite = () => this.#eTramit.value;
	isAut = () => (this.getTramite() == "AUT");
	isAutA7j = () => (this.isAut() || this.isA7j());
	isRutaUnica = () => (this.isAutA7j() || this.is1Dia());
	isLocalizaciones = () => (this.isMun() || this.isAutA7j());
	isMaps = () => (!this.isLocalizaciones() && !this.is1Dia());

	getFinanciacion = () => this.#eFin.value;
	isIsu = () => (this.#eFin.value == "ISU") || (this.#eFin.value == "xSU");
	isA83 = () => (this.#eFin.value == "A83") || (this.#eFin.value == "x83");
	isACA = () => (this.#eFin.value == "ACA") || (this.#eFin.value == "xAC");
	isOTR = () => (this.#eFin.value == "OTR") || (this.#eFin.value == "xOT");

	getColectivo = () => this.#eCol.innerText;
	setColectivo = val => { this.#eCol.innerText = val; return this; }
	getOrganicas = () => this.#organicas;
	isEmpty = () => this.#organicas.isEmpty();

	update = () => {
		this.#eFin.value = this.#organicas.getFinanciacion(); //recalculo la financiacion
		this.select(this.#eAct, getActividad(this.#eRol.value, this.#eCol.innerText, this.#eFin.value))
			.select(this.#eTramit, this.isCom() ? 7 : 1); //default = AyL
		return this.refresh(irse);
	}

	init = () => {
		irse.isIsu = this.isIsu; // current input value
		this.set("not-isu", () => !this.isIsu()).set("not-mun", () => !this.isMun());
		this.set("isFin", el => (this.#eFin.value == el.dataset.fin));
		const fnPDI = el => { el.show(); el.children[2].hide(); } // show autocomplete + hide add button
		this.set("update-organica", el => (irse.isUxxiec() ? el.setVisible(this.#organicas.isEmpty()) : fnPDI(el)));

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		this.setClick("a#reg-externo", ev => { this.copyToClipboard(url); ev.preventDefault(); });
		tabs.setActiveEvent(2, this.isMaps).setActiveEvent(3, this.isIsu);
		tabs.setAction("addOrganica", () => {
			const current = this.#acOrganica.getItem();
			current ? this.#organicas.push(current) : this.#acOrganica.reload(); // new organica
			this.#acOrganica.setValue(); // remove selected
		});
		tabs.setAction("paso0", () => {
			if (!valid.perfil()) return; // if error => stop
			if (!irse.isEditableP0()) return tabs.nextTab();
			loading(); window.rcPaso0(); // call server
		});
		this.afterReset(() => {
			this.#organicas.reset();
			this.#eCol.parentNode.hide();
			this.#acInteresado.setValue();
			this.update();
		});
	}

	view = organicas => {
		this.#eRol = this.getInput("#rol");
		this.#eCol = this.querySelector("#colectivo");
		this.#eFin = this.getInput("#financiacion");
		this.#eAct = this.getInput("#actividad");
		this.#eTramit = this.getInput("#tramite");
		this.#acInteresado = this.setAutocomplete("#interesado", {
			delay: 600, //milliseconds between keystroke occurs and when a search is performed
			minLength: 5, //reduce matches
			source: term => api.init().json("/uae/iris/interesados", { term }).then(this.#acInteresado.render),
			render: item => item.nif + " - " + item.nombre,
			select: item => {
				const email = item.email;
				const mailto = this.#eCol.nextElementSibling.setVisible(email); // Show icon
				this.setAttribute(mailto, "href", "mailto:" + email); // update href
				this.setColectivo(item.ci).update(); //actualizo colectivo + tramite
				this.#eCol.parentNode.show(); //muestro el colectivo
				return item.nif;
			},
			onReset: () => this.#eCol.parentNode.hide()
		});

		this.#acOrganica = this.setAutocomplete("#organica", {
			minLength: 4,
			source: term => api.init().json("/uae/iris/organicas", { term }).then(this.#acOrganica.render),
			render: item => item.o + " - " + item.dOrg,
			select: item => {
				if (!irse.isUxxiec())
					this.#organicas.render([ item ]); // render table
				return item.id;
			},
			onReset: () => {
				if (!irse.isUxxiec())
					this.#organicas.reset();
			}
		});

		this.#organicas.render(organicas);
		this.#acInteresado.setEditable(irse.isEditableP0());
		this.#eCol.parentNode.setVisible(this.#acInteresado.isLoaded()); //muestro el colectivo
		this.#eAct.addEventListener("change", this.update); // actualizo el perfil al cambiar la actividad
		i18n.set("pasos", 2 + this.isIsu() + this.isMaps()); // set global number of pasos
		irse.getPasoMaps = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isMaps()).get("lblPasos"), irse);
	}
}
