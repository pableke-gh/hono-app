
import FormHTML from "../../core/components/forms/Form.js";
import FileBanck from "../components/FileBanck.js";

import Save from "../components/buttons/Save.js";
import Excel from "../components/buttons/Excel.js";

export default class Conciliar extends FormHTML {
	// Override table reference
	getAccordion() { return this.getTable(); }
	setAccordion(accordion) { this.setTable(accordion); }

	restart() {
		this.closeAlerts();
		this.setTable(null);
		this.elements.save.hide();
		this.elements.excel.hide();
	}
}

customElements.define("file-banck", FileBanck, { extends: "input" });
customElements.define("btn-save", Save, { extends: "button" });
customElements.define("recibos-excel", Excel, { extends: "button" });
