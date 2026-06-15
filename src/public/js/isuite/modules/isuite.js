
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import rb from "../lib/RecibosBancarios.js";
import TB_CONFIG from "../lib/Tables.js";

class IsuiteForm extends FormBase {
	#btnSave = this.querySelector("a[href='#tab-action-save']");
	#iSearch = $("[group=search]").keydown(ev => { if (ev.keyCode == 13) { ev.preventDefault(); this.search(); } });
	#tables = $("table[tb-columns]").tbInit(TB_CONFIG).tbRead(TB_CONFIG).tbOrder(TB_CONFIG);

	constructor() {
		super("isuite"); // Must call super before 'this'

		tabs.setAction("search", this.search);
		tabs.setAction("excel", link => api.download(B64MT.xls + this.#tables.filter(".tb-push").xls(TB_CONFIG).utf8ToB64(), link.download));
		tabs.setAction("tr", link => api.download(B64MT.txt + rb.tr57to43().n43Fetch().utf8ToB64(), link.download));
		tabs.setAction("save", () => api.init().json("/uae/ttpp/save").then(() => this.#btnSave.hide())); // read params from sesion => loaded by /uae/ttpp/load

		$("select[id$=ejercicio]").change(function() { $("[id$=srv-search]").click(); });
		const at = $("a#tabla, a#pivot").click(() => { toggle(at); return !toggle(this.#tables); });

		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	}

	search = () => this.#tables.tbFilter(TB_CONFIG);
	ilike = row => this.#iSearch.ilike(row);
	reset() {
		this.#btnSave.hide();
		this.#iSearch.val("");
		this.#tables.tbReset(TB_CONFIG);
		return !rb.reset();
	}
	setNorma(norma, table) {
		TB_CONFIG.current = norma;
		this.#tables.tbPush(TB_CONFIG);
		delete norma.references;
		table.data.reset();
		this.#btnSave.show();
	}
}

export default new IsuiteForm();
