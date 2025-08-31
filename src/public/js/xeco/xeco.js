
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "../i18n/langs.js";

import model from "./model/Solicitud.js";
import firma from "./model/Firma.js";

import firmas from "./modules/firmas.js";
import list from "./modules/list.js";

function XecoForm() {
	//const self = this; //self instance
	const url = model.getUrl(); // url base path
	const form = new Form("#xeco-model");

	this.getForm = () => form;
	this.refresh = () => form.refresh(model);
	this.getTable = list.getTable;

	this.init = () => {
		list.init();
		firmas.init();
	}

	this.view = (data, principales, tab) => {
		model.setData(data); // 1º carga los datos de la solicitud
		firmas.view(principales); // 2º cargo la vista de firmas asociadas
		// 2º force last action => update form views and go to tab form
		form.closeAlerts().setCache(data.id).setData(data, ":not([type=hidden])");
		setTimeout(() => form.setValues(data).setEditable().refresh(model), 1); // execute at the end
		list.setCache(data.id); // filter form cache = xeco form cache!
		tabs.showTab(tab || "form"); // go form tab
	}
	this.update = (data, principales, tab) => {
		data && model.setData(data); // 1º carga los datos de la solicitud
		principales && firmas.view(principales); // 2º actualizo la vista de firmas asociadas
		// 3º and last action => update views and go to specific tab
		setTimeout(() => form.setChanged().refresh(model).nextTab(tab), 1);
	}

	const pfUpload = el => { // pf upload component
		const fnFile = form.get(el.dataset.file) || globalThis.void; // event change handler
		const file = el.previousElementSibling.querySelector("[type='file']"); // input element
		const setFilename = () => { el.nextElementSibling.innerHTML = file.files[0]?.name || ""; } // update filename
		file.onchange = ev => { setFilename(); fnFile(ev, file, el); }
		el.onclick = ev => { ev.preventDefault(); file.click(); }
		setFilename(); // clear filename element
		return true; // visible
	}

	/*** Init. actions for model form ***/
	form.set("is-admin", model.isAdmin).set("is-uae", model.isUae).set("is-usu-ec", model.isUsuEc)
		.set("is-disabled", model.isDisabled).set("is-editable", model.isEditable).set("is-editable-uae", model.isEditableUae)
		.set("is-firmable", model.isFirmable).set("is-cancelable", model.isCancelable).set("is-invalidable", model.isInvalidable)
		.set("is-documentable", model.isDocumentable).set("is-removable", model.isRemovable).set("pf-upload", pfUpload)
		.set("is-reactivable", model.isReactivable).set("is-subsanable", model.isSubsanable);

	tabs.setAction("firmar", () => {
		if (!i18n.confirm("msgFirmar")) return; // confirmation
		const data = Object.assign(model.getData(), form.getData());
		api.setJSON(data).json(url + "/firmar").then(list.loadFirmas);
	});

	tabs.setAction("reject", () => list.getTable().invoke("#tab-reject")); // open reject tab from list
	const fnRechazar = id => api.init().json(url + "/rechazar", { id, rechazo: form.getValueByName("rechazo") }).then(list.loadFirmas);
	tabs.setAction("rechazar", () => { form.validate(firma.validate) && i18n.confirm("msgRechazar") && fnRechazar(list.getId()); });
	const fnCancelar = id => api.init().json(url + "/cancelar", { id, rechazo: form.getValueByName("rechazo") }).then(list.loadFirmas);
	tabs.setAction("cancelar", () => { form.validate(firma.validate) && i18n.confirm("msgCancelar") && fnCancelar(list.getId()); });
	tabs.setAction("reactivar", () => { model.setSubsanable(); form.setEditable().refresh(model); }); // set inputs to editable
	//tabs.setAction("click-next", link => { link.nextElementSibling.click(); setTimeout(window.working, 450); });
	tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
}

export default new XecoForm();
