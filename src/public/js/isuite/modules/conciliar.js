
import FormHTML from "../../core/components/forms/Form.js";
import FileBanck from "../components/FileBanck.js";
import Save from "../components/Save.js";

import rb from "../lib/RecibosBancarios.js";
import TB_CONFIG from "../lib/Tables.js";

export default class Conciliar extends FormHTML {
	#tables = $("table[tb-columns]").tbInit(TB_CONFIG).tbRead(TB_CONFIG).tbOrder(TB_CONFIG);

	reset() {
		this.elements.save.hide();
		//this.#iSearch.val("");
		this.#tables.tbReset(TB_CONFIG);
		return !rb.reset();
	}
	setNorma(norma, table) {
		this.elements.save.show();
		TB_CONFIG.current = norma;
		this.#tables.tbPush(TB_CONFIG);
		delete norma.references;
		table.data.reset();
	}
}

customElements.define("file-banck", FileBanck, { extends: "input" });
customElements.define("btn-save", Save, { extends: "button" });
