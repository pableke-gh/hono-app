
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

function Iris() {
	const self = this; //self instance
	const form = new Form("#xeco-irse");

	this.getForm = () => form;
	this.init = () => {
		form.update().render(".i18n-tr-h1").setCache(window.IRSE.id); // current cache id
		form.onChangeInputs("[name='objeto-temp']", ev => form.setStrval("#objeto", ev.target.value));
		form.onChangeInputs("[name='matricula-vp']", ev => form.setStrval("#matricula", ev.target.value));
		return self;
	}
	this.update = () => {
		form.reset(".ui-json"); // clean inputs
		return self;
	}

	/*********** View Actions ***********/
	window.fnRemove = () => i18n.confirm("removeCom") && loading();
	window.isCached = (id, tab) => (form.isCached(id) && tabs.showTab(tab)); // if cached avoid navegation
	window.saveTab = () => form.showOk(i18n.get("saveOk")).working();
}

export default new Iris();
