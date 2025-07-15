
import tabs from "../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import presto from "../model/Presto.js";
import pDec from "./partidaDec.js";
import pInc from "./partidaInc.js";
import xeco from "../../xeco/xeco.js";

function Presto() {
	const form = xeco.getForm();

	this.init = () => {
		// init. modules actions
		xeco.init(); pDec.init(); pInc.init();

		tabs.setActive(presto.isUxxiec() ? "init" : "list");
		form.set("show-partida-dec", presto.isPartidaDec).set("show-imp-cd", presto.isImpCd)
			.set("show-partida-inc", presto.showPartidasInc).set("show-memoria", () => !presto.isL83())
			.set("is-fce", presto.isFce).set("is-urgente", presto.isUrgente)
			.set("show-subtipo", () => (presto.isUae() && presto.isGcr()));

		// Init. form events
		const fnSync = ev => form.eachInput(".ui-ej", el => { el.value = ev.target.value; }); 
		const fnUrgente = ev => form.setVisible("[data-refresh='is-urgente']", ev.target.value == "2");
		form.onChangeInput("#urgente", fnUrgente).onChangeInputs(".ui-ej", fnSync);
	}

	this.view = data => {
		data.presto.ej = data.presto.ejDec; // sync ejercicios
		data.presto.adjunto = data.adjunto; // sync adjunto
		form.setLabels("select.ui-ej", data.ejercicios); // update field values
		xeco.view(data.presto, data.firmas); // load data-model before view
		pDec.view(data.presto, data.economicas); // vista de la partida a decrementar
		pInc.view(data.partidas); // cargo la tabla de partidas a incrementar
	}

	presto.view = this.view; // load view when list action
	this.update = data => xeco.update(data.presto, data.firmas, data.tab); // Update view

	// xeco-model form actions
	function fnValidate(msgConfirm, fn) {
		const data = form.validate(presto.validate);
		if (!data || !i18n.confirm(msgConfirm))
			return false; // Errores al validar o sin confirmacion
		presto.getPartidas().setPrincipal(); //marco la primera como principal
		// serialize table data and call to specific action
		form.saveTable("#partidas-json", pInc.getTable()).invoke(fn);
		//data.partidas = pInc.getTable().getData(); // listado de partidas a incrementar
		//api.setJSON(data).json("/uae/presto/save").then(msgs => tabs.showMsgs(msgs, "init"));
	}
	tabs.setAction("send", () => fnValidate("msgSend", window.rcSend)); // send xeco-model form
	tabs.setAction("subsanar", () => fnValidate("msgSave", window.rcSubsanar)); // send from changes
}

export default new Presto();
