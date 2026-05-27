
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import Interesado from "../../components/perfil/Interesado.js";
import Organica from "../../components/perfil/Organica.js";
import Actividad from "../../components/perfil/Actividad.js";
import NextPerfil from "../../components/perfil/NextPerfil.js";
import form from "../irse.js"

class Perfil {
	#form = document.forms["xeco-model"];
	#eAct = this.#form.elements["actividad"];

	isColaboracion = () => this.#eAct.isColaboracion();
	isTribunal = () => this.#eAct.isTribunal();
	isFormacion = () => this.#eAct.isFormacion();
	isCom = () => this.#eAct.isCom();
	isMun = () => this.#eAct.isMun();
	isMes = () => this.#eAct.isMes();
	isIae = () => this.#eAct.isIae();
	isAtr = () => this.#eAct.isAtr();
	isAfo = () => this.#eAct.isAfo();
	isAcs = () => this.#eAct.isAcs();
	isCtp = () => this.#eAct.isCtp();
	isOce = () => this.#eAct.isOce();
	isA7j = () => this.#eAct.isA7j();
	isMov = () => this.#eAct.isMov();
	is1Dia = () => this.#eAct.is1Dia();

	getTramite = () => form.getValue("tramite");
	isAut = () => (this.getTramite() == "AUT");
	isAutA7j = () => (this.isAut() || this.isA7j());
	isRutaUnica = () => (this.isAutA7j() || this.is1Dia());
	isLocalizaciones = () => (this.isMun() || this.isAutA7j());
	isMaps = () => (!this.isLocalizaciones() && !this.is1Dia());

	getFinanciacion = () => irse.getFinanciacion();
	isIsu = () => (irse.getFinanciacion() == "ISU") || (irse.getFinanciacion() == "xSU");
	isA83 = () => (irse.getFinanciacion() == "A83") || (irse.getFinanciacion() == "x83");
	isACA = () => (irse.getFinanciacion() == "ACA") || (irse.getFinanciacion() == "xAC");
	isOTR = () => (irse.getFinanciacion() == "OTR") || (irse.getFinanciacion() == "xOT");
	getOrganicas = () => form.getElement("organica").getOrganicas();

	init = () => {
		irse.isIsu = this.isIsu; // current input value
		form.set("not-isu", () => !this.isIsu()).set("not-mun", () => !this.isMun());
		form.set("isFin", el => (irse.getFinanciacion() == el.dataset.fin));

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", ev => { form.copyToClipboard(url); ev.preventDefault(); });
		tabs.setActiveEvent(2, this.isMaps).setActiveEvent(3, this.isIsu);
		form.afterReset(() => {
			form.getElement("interesado").clear();
			form.getElement("organica").clear();
		});
	}

	view = (interesado, organicas) => {
		i18n.set("pasos", 2 + this.isIsu() + this.isMaps()); // set global number of pasos
		irse.getPasoMaps = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isMaps()).get("lblPasos"), irse);

		form.closeAlerts().prepare(irse).setCache(irse.getId()); // prepare all fields
		form.getElement("interesado").setInteresado(interesado); // load autocomplete
		form.getElement("organica").setOrganicas(organicas); // load autocomplete + table
		form.setValue("tramite", irse.getTramite()); // AyL, AUT or LIQ
	}
}

customElements.define("interesado-input", Interesado, { extends: "input" });
customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("actividades-list", Actividad, { extends: "select" });
customElements.define("next-perfil", NextPerfil, { extends: "button" });

export default new Perfil();
