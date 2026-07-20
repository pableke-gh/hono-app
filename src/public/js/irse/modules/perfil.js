
import tabs from "../../core/components/tabs/TabsOld.js";
import i18n from "../i18n/langs.js";

import Actividad from "../components/perfil/Actividad.js";
import Interesado from "../components/perfil/Interesado.js";
import MsgFinanciacion from "../components/perfil/MsgFinanciacion.js";
import NextPerfil from "../components/perfil/NextPerfil.js";
import Organica from "../components/perfil/Organica.js";
import irse from "../model/Irse.js";
import form from "./irse.js";

class Perfil {
	#eAct = document.forms.solicitud.elements.actividad;

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
	getOrganicas = () => form.getElement("organica").getOrganicas();

	init() {
		form.set("not-isu", () => !irse.isIsu()).set("not-mun", () => !this.isMun());
		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", ev => { form.copyToClipboard(url); ev.preventDefault(); });
		tabs.setActiveEvent(2, this.isMaps).setActiveEvent(3, irse.isIsu);
		form.afterReset(() => {
			form.getElement("interesado").clear();
			form.getElement("organica").clear();
		});
	}

	view(interesado, organicas, firmas) {
		i18n.set("pasos", 2 + irse.isIsu() + this.isMaps()); // set global number of pasos
		irse.getPasoMaps = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isMaps()).get("lblPasos"), irse);

		form.closeAlerts().setFirmas(firmas).prepare(irse).setCache(irse.getId()); // prepare all fields
		form.getElement("interesado").setInteresado(interesado); // load autocomplete
		form.getElement("organica").setOrganicas(organicas); // load autocomplete + table
		form.setValue("tramite", irse.getTramite()); // AyL, AUT or LIQ
	}
}

customElements.define("interesado-input", Interesado, { extends: "input" });
customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("actividades-list", Actividad, { extends: "select" });
customElements.define("msg-financiacion", MsgFinanciacion, { extends: "p" });
customElements.define("next-perfil", NextPerfil, { extends: "button" });

export default new Perfil();
