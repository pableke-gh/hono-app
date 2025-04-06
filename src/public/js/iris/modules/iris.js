
import iris from "../model/Iris.js";
import xeco from "../../xeco/xeco.js";

function Iris() {
	//const self = this; //self instance
	const form = xeco.getForm();

	this.getForm = () => form;
	this.getValidators = form.getValidators;

	this.init = () => {
		xeco.init(); // init. actions
		form.set("is-resumable", iris.isResumable);
		form.onChangeInputs(".ui-pf", (ev, el) => { el.previousElementSibling.value = ev.target.value; }); // update pf inputs 
		form.onChangeInputs(".ui-matricula", ev => form.eachInput(".ui-matricula", el => { el.value = ev.target.value; }));
	}

	this.view = (data, firmas) => {
		iris.setData(data).init(data); // set codigo, perfil, titulo...
		form.reset("input[id$='-json']"); // update fields
		xeco.view(data, firmas); // load data-model before view
	}

	this.update = (data, firmas, tab) => {
		form.reset("input[id$='-json']"); // update fields
		xeco.update(data, firmas, tab); // Update firmas blocks
	}
}

export default new Iris();
