
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import buzon from "../model/Buzon.js";
import usuario from "../model/Usuario.js";

function Usuarios() {
	//const self = this; //self instance
    const form = new Form("#xeco-users");
	const tUsuarios = new Table("#usuarios", usuario.getTable());
	tUsuarios.setRemove(data => { // remove handler
		api.init().text("/uae/buzon/user/remove", { org: data.oCod, nif: data.nif }).then(form.setOk);
		return buzon.setData(data).setChanged(true); // force reload table
	});

    const fnToggle = data => {
		const params = { org: data.org, nif: data.nif, acc: data.acc };
		api.init().json("/uae/buzon/user/toggle", params).then(form.resolve).then(tUsuarios.reload);
	}
	tUsuarios.set("#toggleUsers", data => { buzon.setData(data).togglePermisoUser(); fnToggle(data); });
	tUsuarios.set("#toggleGastos", data => { buzon.setData(data).toggleGastos(); fnToggle(data); });
	tUsuarios.set("#toggleIngresos", data => { buzon.setData(data).toggleIngresos(); fnToggle(data); });
	tUsuarios.set("#toggleReportProv", data => { buzon.setData(data).toggleReportProv(); fnToggle(data); });
	tUsuarios.set("#toggleFactura", data => { buzon.setData(data).toggleFactura(); fnToggle(data); });

	const acUser = form.setAutocomplete("#acUsuarios");
	const fnSource = term => api.init().json("/uae/buzon/usuarios/filter", { term }).then(acUser.render);
	acUser.setItemMode(4).setSource(fnSource);

	tabs.setAction("add-user", () => {
		const params = { org: buzon.getOrganica(), ut: buzon.getUnidadTramit(), nif: acUser.getValue() };
		const fnUsuarios = data => tUsuarios.render(data.usuarios).showOk("saveOk");
		api.init().json("/uae/buzon/user/add", params).then(form.resolve).then(fnUsuarios);
		acUser.reload(); // clear data and autofocus
	});
	tabs.setAction("save-users", () => tabs.showTab(0).showOk("saveOk"));

	this.loadUsuarios = data => {
		if (form.isCached(data.oCod))
			return form.nextTab(10);
		api.init().json("/uae/buzon/usuarios?org=" + data.oCod).then(usuarios => {
			buzon.setData(data); // load data model
			tUsuarios.render(usuarios); // load table
			form.setCache(data.oCod).refresh(data).nextTab(10);
		});
	}
}

export default new Usuarios();
