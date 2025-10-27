
import coll from "../../components/CollectionHTML.js";
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import firma from "../model/Firma.js";
import Base from "./Base.js";

export default class FormModule extends Base {
	static #form = new Form("#xeco-model");

	getForm = () => FormModule.#form;
	set = (name, fn) => { FormModule.#form.set(name, fn); return this; }
	refresh = () => FormModule.#form.refresh(this.getModel());
	updateRow = () => { throw new Error('You have to implement the method updateRow!'); }

	setFirmas = firmas => {
		if (!firmas) // compruebo si hay firmantes
			return this.#form.set("update-firmas", null);
		const tpl = coll.render(firmas.slice(1), firma.render);
		this.#form.set("update-firmas", el => {
			el.children[2].innerHTML = tpl; // render block
			if (model.isInvalidada()) { // rechazado o cancelado
				const rechazo = firmas.find(firma.isRechazada);
				rechazo.rejectedBy = firma.getNombre(rechazo);
				el.children[3].render(rechazo);
			}
			else
				el.children[3].hide();
			el.show();
		});
		this.#form.reset("#rechazo");
	}

	init = () => {
		const model = this.getModel(); // model
		const form = this.getForm(); // form component
		const url = model.getUrl(); // url base path

		const fnUpdateEstado = (estado, firmas) => {
			model.setEstado(estado); // update estado
			self.setFirmas(firmas); // update firmas blocks
			list.update(); // update row in list
		}
		tabs.setAction("firmar", () => {
			if (!i18n.confirm("msgFirmar")) return; // confirm
			const data = Object.assign(model.getData(), form.getData());
			api.setJSON(data).json(url + "/firmar").then(data => fnUpdateEstado(16, data.firmas));
		});
	
		const fnInvalidar = (msg, accion, estado) => {
			if (!form.validate(firma.validate) || !i18n.confirm(msg)) return; // stop action
			const params = { id: list.getId(), rechazo: form.getValueByName("rechazo") } // url params
			api.init().json(url + accion, params).then(data => fnUpdateEstado(estado, data.firmas));
		}
		tabs.setAction("rechazar", () => fnInvalidar("msgRechazar", "/rechazar", 2)); // call rechazar
		tabs.setAction("cancelar", () => fnInvalidar("msgCancelar", "/cancelar", 7)); // call cancelar
		tabs.setAction("reactivar", () => form.setEditable(model.setSubsanable()).refresh(model)); // set inputs to editable
		tabs.setAction("clickNext", link => { link.nextElementSibling.click(); }); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
		tabs.setAction("reject", () => { // refresh and open reject tab from list
			const fnUpdate = el => el.setVisible(form.isCached(list.getId()));
			form.set("update-firmas", fnUpdate).refresh(model);
			tabs.showTab("reject");
		});
	}

	view = (data, principales) => {
		this.setData(data); // 1º carga los datos de la solicitud
		this.setFirmas(principales); // 2º cargo la vista de firmas asociadas
		FormModule.#form.setCache(data.id).setData(data); // 3º set cache + load data into form
	}

	update = (data, principales) => {
		data && this.setData(data); // 1º carga los datos de la solicitud
		principales && this.setFirmas(principales); // 2º actualizo la vista de firmas asociadas
	}
}
