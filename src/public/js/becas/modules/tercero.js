
import Tab from "../../core/components/tabs/Tab.js";
import tercero from "../model/Tercero.js";

import TerceroAutocomplete from "../components/tercero/Tercero.js";
import AddTercero from "../components/tercero/AddTercero.js";

import NifTercero from "../components/tercero/Nif.js";
import Cuentas from "../components/tercero/Cuentas.js";
import Paises from "../components/tercero/Paises.js";
import CreateTercero from "../components/tercero/Create.js";

export default class TerceroTab extends Tab {
	beforeView() {
		const form = document.forms.beca;
		if (form.tercero.isEmpty()) {
			form.nif.reset(); form.doc.reset(); form.estado.reset();
			form.nombre.reset(); form.ap1.reset(); form.ap2.reset(); form.email.reset();
			form.residencia.reset(); form.dir.reset(); form.mun.reset(); form.cp.reset();
			form.cuentas.clear(); form.paisEntidad.reset(); form.swift.reset(); form.imp.reset();
		}
		else {
			form.nif.setValue(tercero.getNif());
			form.doc.setValue(tercero.get("doc"));
			form.estado.setValue(tercero.getEstado());
			form.nombre.setValue(tercero.get("nombre"));
			form.ap1.setValue(tercero.get("ap1"));
			form.ap2.setValue(tercero.get("ap2"));
			form.email.setValue(tercero.get("email"));
			form.residencia.setValue(tercero.get("residencia"));
			form.dir.setValue(tercero.get("dir"));
			form.mun.setValue(tercero.get("mun"));
			form.cp.setValue(tercero.get("cp"));

			form.paisEntidad.setValue(tercero.getPaisEntidad());
			form.cuentas.setValue(tercero.getIban());
			form.swift.setValue(tercero.get("swift"));
			form.imp.setValue(tercero.getImporte());
		}
		form.tercero.clear();
		return form.closeAlerts();
	}

	afterView() {
		document.forms.beca.nif.focus();
	}
}

customElements.define("ac-tercero", TerceroAutocomplete, { extends: "input" });
customElements.define("add-tercero", AddTercero, { extends: "button" });
customElements.define("nif-input", NifTercero, { extends: "input" });
customElements.define("cuentas-list", Cuentas, { extends: "select" });
customElements.define("paises-list", Paises, { extends: "select" });
customElements.define("create-tercero", CreateTercero, { extends: "button" });
