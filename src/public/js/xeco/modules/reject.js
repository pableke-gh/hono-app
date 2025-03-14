
import Form from "../../components/forms/Form.js";
import i18n from "../../i18n/langs.js";
import Solicitud from "../model/Solicitud.js";

function Reject() {
	const self = this; //self instance
	const form = new Form("#xeco-reject");

	this.getForm = () => form;
	this.isCached = form.isCached;
	this.setCache = id => { form.setCache(id); return self; }
	this.reset = () => { form.restart("#rechazo"); return self; }

	window.fnFirmar = () => {
		return i18n.confirm("msgFirmar") && window.loading();
	}
	window.fnRechazar = () => {
		const model = Solicitud.self();
		return form.validate(model.validateReject) && i18n.confirm("msgRechazar") && window.loading();
	}
}

export default new Reject();
