
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";

import buzon from "../../model/Buzon.js";
import Usuarios from "../tables/usuarios.js";

export default class UsuariosForm extends Form {
	#acUser = this.setAutocomplete("#acUsuarios");
	#usuarios = new Usuarios(this);

	constructor() {
		super("xeco-users");
	}

	init() {
		this.#usuarios.init(); // init table
		const fnSource = term => api.init().json("/uae/buzon/usuarios/filter", { term }).then(this.#acUser.render);
		this.#acUser.setItemMode(4).setSource(fnSource);

		tabs.setAction("add-user", () => {
			if (!this.#acUser.isLoaded()) return this.#acUser.reload(); // nada que hacer
			const params = { org: buzon.getOrganica(), ut: buzon.getUnidadTramit(), nif: this.#acUser.getValue() };
			const fnUsuarios = data => this.#usuarios.render(data.usuarios).showOk("saveOk");
			api.init().json("/uae/buzon/user/add", params).then(fnUsuarios);
			this.#acUser.reload(); // clear data and autofocus
		});
		tabs.setAction("save-users", () => tabs.showTab(0).showOk("saveOk"));
	}

	load(data) {
		if (this.isCached(data.oCod))
			return tabs.nextTab(10);
		api.init().json("/uae/buzon/usuarios?org=" + data.oCod).then(usuarios => {
			buzon.setData(data); // load data model
			this.#usuarios.render(usuarios); // load table
			this.setCache(data.oCod).refresh(data).nextTab(10);
		});
	}
}
