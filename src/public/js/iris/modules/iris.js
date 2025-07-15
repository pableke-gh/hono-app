
import tabs from "../../components/Tabs.js";

import iris from "../model/Iris.js";
import listIsu from "./isu/list.js";

import xeco from "../../xeco/xeco.js";
import list from "../../xeco/modules/list.js";

function Iris() {
	//const self = this; //self instance
	const form = xeco.getForm();

	this.getForm = () => form;
	this.getValidators = form.getValidators;

	this.init = () => {
		xeco.init(); // init. actions in table and form
		form.set("is-resumable", iris.isResumable).set("is-urgente", iris.isUrgente);
		form.onChangeInputs(".ui-pf", (ev, el) => { el.previousElementSibling.value = ev.target.value; }); // update pf inputs 

		const fnPaso8 = data => (i18n.confirm("msgReactivarP8") && list.send(window.rcPaso8, data));
		list.getTable().set("#rcPaso8", fnPaso8); // set table action
	}

	this.view = (data, firmas) => {
		xeco.view(data, firmas); // load view
	}

	this.update = (data, firmas, tab) => {
		form.reset("input[id$='-json']"); // update fields
		xeco.update(data, firmas, tab); // Update firmas blocks
	}

	/*********** Extra list actions ***********/
	list.getTable().set("#rcFinalizar", data => list.send(window.rcFinalizar, data)); // html report
	tabs.setAction("finalizar", () => list.send(window.rcFinalizar)); // set tab action

	/*********** Listado ISU - Justifi OTRI ***********/
	tabs.setInitEvent("listIsu", listIsu.init);
}

export default new Iris();
