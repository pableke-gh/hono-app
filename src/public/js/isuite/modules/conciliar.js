
import FormHTML from "../../core/components/forms/Form.js";
import FileBanck from "../components/FileBanck.js";

import Save from "../components/buttons/Save.js";
import Excel from "../components/buttons/Excel.js";

export default class Conciliar extends FormHTML {
	showBack() {
		const back = this.parentNode.lastElementChild;
		back.previousElementSibling.classList.remove("hide"); // hr
		back.classList.remove("hide"); // button
	}

	restart() {
		this.closeAlerts();
		this.elements.save.hide();
		this.elements.excel.hide();
	}
}

customElements.define("file-banck", FileBanck, { extends: "input" });
customElements.define("btn-save", Save, { extends: "button" });
customElements.define("recibos-excel", Excel, { extends: "button" });
