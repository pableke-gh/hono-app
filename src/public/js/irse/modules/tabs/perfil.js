
import FormBase from "../../../components/forms/FormBase.js";
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import Interesado from "../inputs/Interesado.js";
import Organica from "../inputs/Organica.js";
import getActividad from "../../data/perfiles/actividades.js";

export default class Perfil extends FormBase {
	#acInteresado = this.getElement("interesado");
	#acOrganica = this.getElement("organica");
	#eFin = this.getElement("financiacion");
	#eAct = this.getElement("actividad");

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	getRol = () => this.getValue("rol");
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

	getTramite = () => this.getValue("tramite");
	isAut = () => (this.getTramite() == "AUT");
	isAutA7j = () => (this.isAut() || this.isA7j());
	isRutaUnica = () => (this.isAutA7j() || this.is1Dia());
	isLocalizaciones = () => (this.isMun() || this.isAutA7j());
	isMaps = () => (!this.isLocalizaciones() && !this.is1Dia());

	getFinanciacion = () => this.#eFin.value;
	setFinanciacion(fin) { irse.setFinanciacion(fin); this.#eFin.value = fin; return this; }
	isIsu = () => (this.#eFin.value == "ISU") || (this.#eFin.value == "xSU");
	isA83 = () => (this.#eFin.value == "A83") || (this.#eFin.value == "x83");
	isACA = () => (this.#eFin.value == "ACA") || (this.#eFin.value == "xAC");
	isOTR = () => (this.#eFin.value == "OTR") || (this.#eFin.value == "xOT");

	getOrganicas = () => this.#acOrganica.getOrganicas();
	update = () => this.setFinanciacion(this.#acOrganica.getFinanciacion()) // recalculo la financiacion
						.select("actividad", getActividad(this.getValue("rol"), irse.getColectivo(), this.getFinanciacion()))
						.select("tramite", this.isCom() ? 7 : 1) // default = AyL
						.refresh(irse);

	init = () => {
		this.#acInteresado.init();
		this.#acOrganica.init();
		irse.isIsu = this.isIsu; // current input value
		this.set("not-isu", () => !this.isIsu()).set("not-mun", () => !this.isMun());
		this.set("isFin", el => (this.#eFin.value == el.dataset.fin));

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		this.setClick("a#reg-externo", ev => { this.copyToClipboard(url); ev.preventDefault(); });
		tabs.setActiveEvent(2, this.isMaps).setActiveEvent(3, this.isIsu);
		tabs.setAction("paso0", () => {
			if (!valid.perfil()) return; // if error => stop
			if (!irse.isEditableP0()) return tabs.next();
			loading(); window.rcPaso0(); // call server
		});
		this.afterReset(() => {
			this.#acInteresado.clear();
			this.#acOrganica.clear();
			this.update();
		});
	}

	view = organicas => {
		this.#eFin = this.getElement("financiacion");
		this.#eAct = this.getElement("actividad");

		this.#acInteresado.setInteresado(); // load autocomplete
		this.#acOrganica.setOrganicas(organicas); // load autocomplete + table
		this.#eAct.addChange(this.update); // actualizo el perfil al cambiar la actividad
		i18n.set("pasos", 2 + this.isIsu() + this.isMaps()); // set global number of pasos
		irse.getPasoMaps = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isMaps()).get("lblPasos"), irse);
	}
}

customElements.define("interesado-input", Interesado, { extends: "input" });
customElements.define("organica-input", Organica, { extends: "input" });
