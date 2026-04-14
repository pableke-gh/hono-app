
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import Interesado from "../inputs/Interesado.js";
import Organica from "../inputs/Organica.js";
import form from "../irse.js"

import observer from "../../../core/util/Observer.js";
import getActividad from "../../data/perfiles/actividades.js";

class Perfil {
	#form = document.forms["xeco-model"];
	#acInteresado = this.#form.elements["interesado"];
	#acOrganica = this.#form.elements["organica"];
	#eAct = this.#form.elements["actividad"];

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
	getOrganicas = () => this.#acOrganica.getOrganicas();

	init = () => {
		irse.isIsu = this.isIsu; // current input value
		form.set("not-isu", () => !this.isIsu()).set("not-mun", () => !this.isMun());
		form.set("isFin", el => (irse.getFinanciacion() == el.dataset.fin));

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", ev => { this.copyToClipboard(url); ev.preventDefault(); });
		observer.subscribe("perfil", () => {
			this.#eAct.select(getActividad(irse.getRol(), irse.getColectivo(), this.getFinanciacion()));
			form.select("tramite", this.isCom() ? 7 : 1); // default = AyL
		});

		tabs.setActiveEvent(2, this.isMaps).setActiveEvent(3, this.isIsu);
		tabs.setAction("paso0", () => {
			if (!valid.perfil()) return; // if error => stop
			if (!irse.isEditableP0()) return tabs.next();
			const data = form.getData(".ui-perfil");
			data.financiacion = irse.getFinanciacion();
			data.organicas = this.#acOrganica.getOrganicas().getData();
			api.setJSON(data).json("/uae/iris/perfil/save").then(data => {
				irse.setData(data.solicitud); // update irse data
				irse.setInteresado(this.#acInteresado.getCurrent()); // preserve interesado
				observer.emit("perfil", irse); // update changes from server (id, fk, text, etc.)
				form.getPaso9().setCuentas(data.cuentas); // cuentas del interesado (desplegable paso9)
				form.setFirmas(data.firmas).reactivate(irse).nextTab(1); // prepare changes and show tab
			});
		});
		form.afterReset(() => {
			this.#acInteresado.clear();
			this.#acOrganica.clear();
		});
	}

	view = organicas => {
		i18n.set("pasos", 2 + this.isIsu() + this.isMaps()); // set global number of pasos
		irse.getPasoMaps = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isMaps()).get("lblPasos"), irse);

		this.#acInteresado.setInteresado(); // load autocomplete
		this.#acOrganica.setOrganicas(organicas); // load autocomplete + table
		this.#eAct.setValue(irse.getActividad()).addChange(() => observer.emit("perfil", irse)); // actualizo el perfil al cambiar la actividad
		form.setValue("tramite", irse.getTramite()); // AyL, AUT or LIQ
	}
}

customElements.define("interesado-input", Interesado, { extends: "input" });
customElements.define("organica-input", Organica, { extends: "input" });

export default new Perfil();
