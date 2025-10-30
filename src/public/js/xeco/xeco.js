
import coll from "../components/CollectionHTML.js";
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "../i18n/langs.js";

import model from "./model/Solicitud.js";
import firma from "./model/Firma.js";
import list from "./modules/list.js";

function XecoForm() {
	const self = this; //self instance
	const url = model.getUrl(); // url base path
	const form = new Form("#xeco-model");

	this.getList = () => list;
	this.getTable = () => list.getTable();
	this.getForm = () => form;
	this.refresh = () => form.refresh(model);
	this.reset = () => { form.resetCache(); list.reset(); tabs.showInit(); }
	window.closeForm = (xhr, status, args) => (window.showAlerts(xhr, status, args) && self.reset()); // PF hack for old version compatibility => remove

	this.getFirmante = firma.getFirmante; // "nif - name" String
	this.findByGrupo = (grupo, firmas) => (firmas && firmas.find(f => (f.grupo === grupo)));
	this.setFirmas = firmas => {
		if (!firmas) // compruebo si hay firmantes
			return form.set("update-firmas", null);
		const tpl = coll.render(firmas.slice(1), firma.render);
		form.set("update-firmas", el => {
			el.children[2].innerHTML = tpl; // render block
			if (model.isInvalidada()) { // rechazado o cancelado
				const rechazo = firmas.find(firma.isRechazada);
				if (!rechazo) return; // clausula de guarda
				rechazo.rejectedBy = firma.getNombre(rechazo);
				el.children[3].render(rechazo);
			}
			else
				el.children[3].hide();
			el.show();
		});
		form.reset("#rechazo");
	}

	this.init = () => { // init form and list
		list.setFirmas = self.setFirmas; // link setFirmas method
		list.showForm = () => { self.refresh(); tabs.showForm(); } // refresh and open from cached
		list.init(); // init list module
	}
	this.view = (data, principales) => {
		model.setData(data); // 1º carga los datos de la solicitud
		self.setFirmas(principales); // 2º cargo la vista de firmas asociadas
		list.setCache(data.id); // 3º set cache para la solicitud actual
		form.setCache(data.id).setData(data, ":not([type=hidden])");
	}
	this.update = (data, principales) => {
		data && model.setData(data); // 1º carga los datos de la solicitud
		principales && self.setFirmas(principales); // 2º actualizo la vista de firmas asociadas
	}

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

export default new XecoForm();
