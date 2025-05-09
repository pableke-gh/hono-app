
import iris from "../model/Iris.js";
import xeco from "../../xeco/xeco.js";

function Iris() {
	//const self = this; //self instance
	const form = xeco.getForm();

	this.getForm = () => form;
	this.getValidators = form.getValidators;

	this.init = () => {
		xeco.init(); // init. actions
		form.set("is-resumable", iris.isResumable).set("is-documentable", iris.isDocumentable).set("is-urgente", iris.isUrgente);
		form.onChangeInputs(".ui-pf", (ev, el) => { el.previousElementSibling.value = ev.target.value; }); // update pf inputs 
	}

	this.view = (data, firmas) => {
		xeco.view(data, firmas); // load view
	}

	this.update = (data, firmas, tab) => {
		form.reset("input[id$='-json']"); // update fields
		xeco.update(data, firmas, tab); // Update firmas blocks
	}
}

export default new Iris();
