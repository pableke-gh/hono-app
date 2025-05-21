
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import i18n from "../i18n/langs.js";

import model from "./model/Solicitud.js";
import firmas from "./modules/firmas.js";
import list from "./modules/list.js";

function XecoForm() {
	//const self = this; //self instance
	const form = new Form("#xeco-model");

	this.getForm = () => form;
	this.refresh = () => form.refresh(model);
	this.sendId = list.sendId;

	this.init = () => {
		list.init();
		firmas.init();

		// hack editable inputs for PF
		form.eachInput(".readonly-manual", el => { el.dataset.readonly = "manual"; });
		form.eachInput(".editable-uae", el => { el.dataset.readonly = "is-editable-uae"; });
	}

	this.view = (data, principales) => {
		model.setData(data); // 1º carga los datos de la solicitud
		firmas.view(principales); // 2º cargo la vista de firmas asociadas
		// 2º force last action => update form views and go to tab form
		form.closeAlerts().setCache(data.id).setData(data, ":not([type=hidden])");
		setTimeout(() => form.setValues(data).setEditable().refresh(model), 1); // execute at the end
		tabs.showTab("form"); // go form tab
	}
	this.update = (data, principales, tab) => {
		data && model.setData(data); // 1º carga los datos de la solicitud
		principales && firmas.view(principales); // 2º actualizo la vista de firmas asociadas
		// 3º and last action => update views and go to specific tab
		setTimeout(() => form.refresh(model).nextTab(tab), 1);
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
	form.set("is-disabled", model.isDisabled).set("is-editable", model.isEditable).set("is-editable-uae", model.isEditableUae)
		.set("is-firmable", model.isFirmable).set("is-cancelable", model.isCancelable).set("is-invalidable", model.isInvalidable)
		.set("is-reactivable", model.isReactivable).set("is-subsanable", model.isSubsanable).set("is-valid", globalThis.void)
		.set("is-removable", model.isRemovable).set("pf-upload", pfUpload);

	tabs.setAction("send", () => { form.fire("is-valid") && i18n.confirm("msgSend") && form.invoke(window.rcSend); }); // send from xeco-model form
	tabs.setAction("firmar", () => { i18n.confirm("msgFirmar") && form.invoke(window.rcFirmarForm); }); // run remote command from xeco-model
	tabs.setAction("reactivar", () => { model.setSubsanable(); form.setEditable().refresh(model); }); // set inputs to editable => TODO: auto call window.rcReactivar if exists
	tabs.setAction("subsanar", () => { form.fire("is-valid") && i18n.confirm("msgSave") && form.invoke(window.rcSubsanar); }); // send from changes
}

export default new XecoForm();
