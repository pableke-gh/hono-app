
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

	this.getList = () => list;
	this.getTable = () => list.getTable();
	this.getForm = () => form;
	this.refresh = () => form.refresh(model);
	this.getFirmas = () => firmas;

	this.init = () => {
		list.init();
		firmas.init();
	}

	this.view = (data, principales) => {
		model.setData(data); // 1º carga los datos de la solicitud
		firmas.view(principales); // 2º cargo la vista de firmas asociadas
		list.setCache(data.id); // 3º set cache para la solicitud actual
		form.setCache(data.id).setData(data, ":not([type=hidden])");
	}
	this.update = (data, principales) => {
		data && model.setData(data); // 1º carga los datos de la solicitud
		principales && firmas.view(principales); // 2º actualizo la vista de firmas asociadas
	}

	const pfUpload = el => { // pf upload component
		const file = el.previousElementSibling.querySelector("[type='file']"); // input element
		const setFilename = () => { el.nextElementSibling.innerHTML = file.files[0]?.name || ""; } // update filename
		file.onchange = ev => {
			setFilename(); // update filename element
			const fnFile = form.get(el.dataset.file) || globalThis.void;
			fnFile(ev, file, el); // event change handler
		}
		el.onclick = ev => { ev.preventDefault(); file.click(); }
		setFilename(); // clear filename element
		return true; // visible
	}

	/*** Init. actions for model form ***/
	form.set("is-admin", model.isAdmin).set("is-uae", model.isUae).set("is-usu-ec", model.isUsuEc)
		.set("is-disabled", model.isDisabled).set("is-readonly", model.isReadonly).set("is-editable", model.isEditable)
		.set("is-firmable", model.isFirmable).set("is-cancelable", model.isCancelable).set("is-invalidable", model.isInvalidable)
		.set("is-documentable", model.isDocumentable).set("is-removable", model.isRemovable).set("is-editable-uae", model.isEditableUae)
		.set("is-reactivable", model.isReactivable).set("is-subsanable", model.isSubsanable).set("pf-upload", pfUpload);

	tabs.setAction("firmar", () => {
		if (!i18n.confirm("msgFirmar")) return; // confirm
		const data = Object.assign(model.getData(), form.getData());
		api.setJSON(data).json(url + "/firmar").then(list.firmar);
	});

	const fnInvalidar = (msg, accion, estado) => {
		if (!form.validate(firma.validate) || !i18n.confirm(msg)) return; // stop action
		const params = { id: list.getId(), rechazo: form.getValueByName("rechazo") } // url params
		api.init().json(url + accion, params).then(data => {
			model.setEstado(estado);
			firmas.view(data.firmas);
			list.update();
		});
	}
	tabs.setAction("reject", () => list.getTable().invoke("#reject")); // open reject tab from list
	tabs.setAction("rechazar", () => fnInvalidar("msgRechazar", "/rechazar", 2)); // call rechazar
	tabs.setAction("cancelar", () => fnInvalidar("msgCancelar", "/cancelar", 7)); // call cancelar
	tabs.setAction("reactivar", () => { model.setSubsanable(); form.setEditable().refresh(model); }); // set inputs to editable
	tabs.setAction("clickNext", link => { link.nextElementSibling.click(); }); // fire click event for next sibling element
	tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
}

export default new XecoForm();
