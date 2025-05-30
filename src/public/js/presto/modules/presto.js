
import tabs from "../../components/Tabs.js";
import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function Presto() {
	const form = xeco.getForm();

	this.getForm = xeco.getForm;
	this.getValidators = form.getValidators;
	//this.getPresto = () => presto;

	this.init = () => {
		xeco.init(); // init. actions
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

	this.view = (data, ejercicios, firmas) => {
		data.ej = data.ejDec; // sync ejercicios
		form.setLabels("select.ui-ej", ejercicios); // update field values
		xeco.view(data, firmas); // load data-model before view
	}

	this.update = (data, firmas, tab) => {
		xeco.update(data, firmas, tab); // Update firmas blocks
	}
}

export default new Presto();
