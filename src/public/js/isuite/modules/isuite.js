
import sb from "../../components/types/StringBox.js";
import api from "../../core/components/Api.js";

import FormHTML from "../../core/components/forms/Form.js";
import GCTable from "../components/paneles/GCTable.js";
import FCBTable from "../components/paneles/FCBTable.js";
import ButtonExcel from "../components/paneles/Excel.js";

export default class IsuiteForm extends FormHTML {
	connectedCallback() {
		super.connectedCallback(); // init. component
		this.elements.ej.setLabels(sb.getEjercicios());

		this.addEventListener("reset", ev => setTimeout(this.list, 1)); // after-reset event
		this.addEventListener("submit", ev => {
			this.isChanged() && this.list();
			ev.preventDefault();
			this.setChanged();
		});
		this.list(); // autoload on view
	}

	list = () => {
		const url = this.getAttribute("action") + "?" + this.getUrlParams().toString();
		api.init().json(url).then(data => this.getTable().render(data));
	}
}

setTimeout(() => { // define after isuite form
	customElements.define("gc-table", GCTable, { extends: "table" });
	customElements.define("fcb-table", FCBTable, { extends: "table" });
	customElements.define("btn-excel", ButtonExcel, { extends: "button" });
}, 1);
