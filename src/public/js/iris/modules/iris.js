
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

function Iris() {
	const self = this; //self instance
	const form = new Form("#xeco-irse");

	this.getForm = () => form;
	this.getValidators = form.getValidators;

	this.update = () => {
		form.reset("input[id$='-json']"); // update fields
		return self;
	}
	this.init = () => {
		form.update().setCache(window.IRSE.id); // current cache id
		form.onChangeInputs("[name='matricula-vp']", ev => form.setStrval("#matricula", ev.target.value));
		return self.update();
	}

	/*********** View Actions ***********/
	window.fnRemove = () => i18n.confirm("removeCom") && loading();
	window.isCached = (id, tab) => (form.isCached(id) && tabs.showTab(tab)); // if cached avoid navegation
	window.saveTab = () => form.showOk(i18n.get("saveOk")).working();
}

export default new Iris();
