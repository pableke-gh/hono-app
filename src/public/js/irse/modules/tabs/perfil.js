
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
	#acInteresado; #acOrganica; #eFin; #eAct;

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

	getFinanciacion = () => this.#eFin.value;
	setFinanciacion(fin) { irse.setFinanciacion(fin); this.#eFin.value = fin; return this; }
	isIsu = () => (this.#eFin.value == "ISU") || (this.#eFin.value == "xSU");
	isA83 = () => (this.#eFin.value == "A83") || (this.#eFin.value == "x83");
	isACA = () => (this.#eFin.value == "ACA") || (this.#eFin.value == "xAC");
	isOTR = () => (this.#eFin.value == "OTR") || (this.#eFin.value == "xOT");
	getOrganicas = () => this.#acOrganica.getOrganicas();

	init = () => {
		this.#acInteresado = form.getElement("interesado");
		this.#acOrganica = form.getElement("organica");

		irse.isIsu = this.isIsu; // current input value
		form.set("not-isu", () => !this.isIsu()).set("not-mun", () => !this.isMun());
		form.set("isFin", el => (this.#eFin.value == el.dataset.fin));

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", ev => { this.copyToClipboard(url); ev.preventDefault(); });
		observer.subscribe("perfil", () => {
			this.setFinanciacion(this.#acOrganica.getFinanciacion()); // recalculo la financiacion
			this.#eAct.select(getActividad(irse.getRol(), irse.getColectivo(), this.getFinanciacion()));
			form.select("tramite", this.isCom() ? 7 : 1); // default = AyL
		});

		tabs.setActiveEvent(2, this.isMaps).setActiveEvent(3, this.isIsu);
		tabs.setAction("paso0", () => {
			if (!valid.perfil()) return; // if error => stop
			if (!irse.isEditableP0()) return tabs.next();
			const data = form.getData(".ui-perfil");
			data.organicas = this.#acOrganica.getOrganicas().getData();
			api.setJSON(data).json("/uae/iris/perfil/save").then(data => {
				irse.setData(data.solicitud); // update irse data
				irse.setInteresado(this.#acInteresado.getCurrent()); // preserve interesado
				observer.emit("perfil", irse); // update changes from server (id, fk, text, etc.)
				form.getPaso9().view(data.cuentas || []); // cuentas del interesado (desplegable paso9)
				form.setFirmas(data.firmas).reactivate(irse).nextTab(1); // prepare changes and show tab
			});
		});
		form.afterReset(() => {
			this.#acInteresado.clear();
			this.#acOrganica.clear();
		});
	}

	view = organicas => {
		this.#eFin = form.getElement("financiacion");
		this.#eAct = form.getElement("actividad");

		i18n.set("pasos", 2 + this.isIsu() + this.isMaps()); // set global number of pasos
		irse.getPasoMaps = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isMaps()).get("lblPasos"), irse);

		this.#acInteresado.setInteresado(); // load autocomplete
		this.#acOrganica.setOrganicas(organicas); // load autocomplete + table
		this.#eAct.addChange(() => observer.emit("perfil", irse)); // actualizo el perfil al cambiar la actividad
	}
}

customElements.define("interesado-input", Interesado, { extends: "input" });
customElements.define("organica-input", Organica, { extends: "input" });

export default new Perfil();
