
import tabs from "../../components/Tabs.js";
import i18n from "../i18n/langs.js";

import xeco from "../../xeco/xeco.js";

function Send() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component

	this.validate = data => {
		//data.totKm = rutas.getTotKm();
console.log(data);
		const valid = i18n.getValidators();
		// todo: validacion de 250 km
		return valid.isOk();
	}

	tabs.setAction("paso9", () => { form.validate(self.validate) && form.sendTab(window.rcPaso9); });
	tabs.setAction("save9", () => { form.validate(self.validate) && form.sendTab(window.rcSave9, 9); });

	this.view = () => {
	}

	this.init = () => {
	}
}

export default new Send();
