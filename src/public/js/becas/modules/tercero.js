
import tabs from "../../core/components/tabs/Tabs.js";

import beca from "../model/Beca.js";
import tercero from "../model/Tercero.js";

import NifTercero from "../components/tercero/Nif.js";
import Cuentas from "../components/tercero/Cuentas.js";
import Paises from "../components/tercero/Paises.js";
import Entidades from "../components/tercero/Entidades.js";
import Iban from "../components/tercero/Iban.js";
import CreateTercero from "../components/tercero/Create.js";
import FormHTML from "../../core/components/forms/Form.js";

export default class TerceroForm extends FormHTML {
	create() {
		tercero.clear(); // clear tercero model
		super.create(tercero.getData()); // clear form
		tabs.show("tercero"); // show tercero tab
		this.nif.focus();
	}

	show() {
		tabs.show("tercero"); // show tercero tab
		this.nombre.focus(); // set focus
	}
	load(data, cuentas) {
		tercero.setData(data); // update tercero model
		this.cuentas.setCuentas(cuentas); // update cuentas list
		super.load(data, beca.isEditable()); // load form with data
		this.show(); // show tab
	}
}

customElements.define("nif-input", NifTercero, { extends: "input" });
customElements.define("cuentas-list", Cuentas, { extends: "select" });
customElements.define("paises-list", Paises, { extends: "select" });
customElements.define("entidades-list", Entidades, { extends: "select" });
customElements.define("iban-input", Iban, { extends: "input" });
customElements.define("create-tercero", CreateTercero, { extends: "button" });
