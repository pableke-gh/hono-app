
import Tab from "../../core/components/tabs/Tab.js";
import TerceroAutocomplete from "../components/tercero/Tercero.js";
import AddTercero from "../components/tercero/AddTercero.js";
import NifTercero from "../components/tercero/Nif.js";
import Paises from "../components/tercero/Paises.js";
import CreateTercero from "../components/tercero/Create.js";

export default class TerceroTab extends Tab {
	beforeView() {
		const form = document.forms.beca;
		form.elements.forEach(el => el.reset());
		form.elements.paisEntidad.reset();
		form.closeAlerts();
	}

	afterView() {
		document.forms.beca.elements.nif.focus();
	}
}

customElements.define("ac-tercero", TerceroAutocomplete, { extends: "input" });
customElements.define("add-tercero", AddTercero, { extends: "button" });
customElements.define("nif-input", NifTercero, { extends: "input" });
customElements.define("paises-list", Paises, { extends: "select" });
customElements.define("create-tercero", CreateTercero, { extends: "button" });
