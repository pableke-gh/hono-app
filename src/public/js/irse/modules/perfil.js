
import api from "../../core/components/Api.js";
import Tab from "../../core/components/tabs/Tab.js";
import observer from "../../core/util/Observer.js";
import valid from "../i18n/validators/irse.js";
import i18n from "../i18n/langs.js";

import irse from "../model/Irse.js";
import form from "./irse.js";

import Interesado from "../components/perfil/Interesado.js";
import Organica from "../components/perfil/Organica.js";
import AddOrganica from "../components/perfil/AddOrganica.js";
import MsgFinanciacion from "../components/perfil/MsgFinanciacion.js";
import Actividad from "../components/perfil/Actividad.js";
import Reset from "../components/perfil/Reset.js";
import Remove from "../components/perfil/Remove.js";

export default class Perfil extends Tab {
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
		super.init(); // init. tab perfol (paso 0)
		this.querySelector("a#reg-externo").addEventListener("click", ev => {
			form.copyToClipboard("https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO");
			ev.preventDefault(); // avoid navigation
		});
	}
	beforeView(tab) { // redirect
		return !tab.isForward() || !irse.isResumable() || super.show(6);
	}
	afterView() {
		const name = irse.isUxxiec() ? "interesado" : "organica";
		form.getElement(name).focus(); // focus on first input
	}

	view(interesado, organicas, firmas) {
		i18n.set("pasos", 2 + irse.isIsu() + this.isMaps()); // set global number of pasos
		irse.getPasoMaps = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isMaps()).get("lblPasos"), irse);

		form.closeAlerts().setFirmas(firmas).prepare(irse).setCache(irse.getId()); // prepare all fields
		form.getElement("interesado").setInteresado(interesado); // load autocomplete
		form.getElement("organica").setOrganicas(organicas); // load autocomplete + table
		form.setValue("tramite", irse.getTramite()); // AyL, AUT or LIQ
	}

	next1() {
		if (!valid.perfil()) return; // if error => stop
		if (!irse.isEditableP0()) // is form readonly?
			return super.next1(); // go next without saving

		const data = form.getData(".ui-perfil");
		data.financiacion = irse.getFinanciacion();
		data.organicas = form.getElement("organica").getOrganicas().getData();
		api.setJSON(data).json("/uae/iris/perfil/save").then(data => {
			irse.setData(data.solicitud); // update irse data
			observer.emit("perfil", irse); // update changes from server (id, fk, text, etc.)
			form.setFirmas(data.firmas); // show firmas list
			form.getPaso9().setCuentas(data.cuentas); // cuentas del interesado (desplegable paso9)
			form.reactivate(irse).nextTab(1); // prepare changes and show tab
		});
	}
}

customElements.define("interesado-input", Interesado, { extends: "input" });
customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("add-organica", AddOrganica, { extends: "button" });
customElements.define("actividades-list", Actividad, { extends: "select" });
customElements.define("msg-financiacion", MsgFinanciacion, { extends: "p" });
customElements.define("btn-reset", Reset, { extends: "button" });
customElements.define("btn-remove", Remove, { extends: "button" });
