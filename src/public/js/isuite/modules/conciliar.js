
import FormHTML from "../../core/components/forms/Form.js";
import FileBanck from "../components/FileBanck.js";

import Save from "../components/buttons/Save.js";
import Excel from "../components/buttons/Excel.js";

export default class Conciliar extends FormHTML {
	#accordion;

	getAccordion() { return this.#accordion; }
	setAccordion(accordion) { this.#accordion = accordion; }

	restart() {
		this.closeAlerts();
		this.#accordion = null;
		this.elements.save.hide();
		this.elements.excel.hide();
	}
}

customElements.define("file-banck", FileBanck, { extends: "input" });
customElements.define("btn-save", Save, { extends: "button" });
customElements.define("recibos-excel", Excel, { extends: "button" });
