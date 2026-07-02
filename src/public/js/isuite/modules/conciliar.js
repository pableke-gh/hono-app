
import FormHTML from "../../core/components/forms/Form.js";
import FileBanck from "../components/FileBanck.js";
import Save from "../components/Save.js";

export default class Conciliar extends FormHTML {
	restart() {
		this.closeAlerts();
		this.elements.save.hide();
	}
}

customElements.define("file-banck", FileBanck, { extends: "input" });
customElements.define("btn-save", Save, { extends: "button" });
