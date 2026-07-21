
import api from "../../core/components/Api.js";
import tabs from "../../core/components/tabs/Tabs.js";

import beca from "../model/Beca.js";

import Tercero from "./tercero.js";
import ButtonBases from "../components/buttons/Bases.js";
import ButtonResolucion from "../components/buttons/Resolucion.js";
import ButtonBeneficiarios from "../components/buttons/Beneficiarios.js";
import ButtonSave from "../components/buttons/Save.js";
import ButtonFirmar from "../components/buttons/Firmar.js";
import ButtonRechazar from "../components/buttons/Rechazar.js";
import ButtonCancelar from "../components/buttons/Cancelar.js";
import ButtonReport from "../components/buttons/Report.js";
import ButtonRemove from "../components/buttons/Remove.js";
import Firmas from "../../core/components/layouts/Firmas.js";
import FormHTML from "../../core/components/forms/Form.js";

export default class BecaForm extends FormHTML {
	getBecas = () => tables.get("becas"); // tabla de solicitudes / registros
	getRegistros = () => this.getBecas(); // tabla de solicitudes / registros

	#load(firmas) {
		Firmas.notify(firmas);
		tabs.showForm(); // show form tab
	}
	create() {
		beca.clear().setEditable();
		super.create(beca.getData()).#load();
	}
	load = row => {
		if (!row) // row required
			return this.create();
		const fnLoad = (data, firmas) => {
			const editable = beca.setData(data).isEditable(); // check if data is editable
			super.load(data, editable).#load(firmas); // load form with data
		}

		if (this.isCached(row.id)) // check if data is cached
			return fnLoad(row, true); // go form tab directly
		const url = `/uae/becas/view?id=${row.id}&a=${row.apli}`; // resource
		api.init().json(url).then(data => { // server response
			fnLoad(row, data.firmas); // show firmas list
		});
	}

	close(firmas) {
		this.isCached(beca.getId()) && Firmas.notify(firmas);
		this.getBecas().showList(); // show list tab
	}
	reject = row => {
		super.notify(row); // notify row
		Firmas.notify(this.isCached(row.id));
		tabs.show("reject"); // show tab
	}

	connectedCallback() {
		super.connectedCallback(); // initialize form
		beca.setUser(this.dataset); // load user info
		tabs.setAction("create", () => this.create()); // set handlers

		const header = this.querySelector("h2"); // form header
		this.addObserver(data => { header.innerText = beca.getTitulo(); });
	}
}

customElements.define("tab-tercero", Tercero, { extends: "div" });
customElements.define("btn-bases", ButtonBases, { extends: "button" });
customElements.define("btn-resolucion", ButtonResolucion, { extends: "button" });
customElements.define("btn-beneficiarios", ButtonBeneficiarios, { extends: "button" });
customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-firmar", ButtonFirmar, { extends: "button" });
customElements.define("btn-rechazar", ButtonRechazar, { extends: "button" });
customElements.define("btn-cancelar", ButtonCancelar, { extends: "button" });
customElements.define("btn-report", ButtonReport, { extends: "button" });
customElements.define("btn-remove", ButtonRemove, { extends: "button" });
customElements.define("firmas-block", Firmas, { extends: "div" });
