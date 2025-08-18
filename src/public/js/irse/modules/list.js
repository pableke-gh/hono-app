
import tabs from "../../components/Tabs.js";
import list from "../../xeco/modules/list.js";
import uxxiec from "./uxxiec.js";
import i18n from "../i18n/langs.js";

function List() {
	this.init = () => {
		const formList = list.getForm(); // Current form
		window.clickVinc = () => formList.reset(".ui-filter").setval("#estado", "1").click("#filter-list");
		window.onList = () => formList.reset(".ui-filter").setval("#firma", "5").loading();
		window.clickList = () => window.onList().click("#filter-list");
		window.onListAll = () => formList.reset(".ui-filter").loading();
		i18n.set("fCache", (new Date()).addDays(-1).toISOString()); // fecha de la cache
	}

	// avoid auto call on init tab
	tabs.setInitEvent("list", globalThis.void);

	/*********** Expediente UXXI-EC ***********/
	tabs.setInitEvent("uxxiec", uxxiec.init);
	tabs.setViewEvent("uxxiec", uxxiec.load);
}

// avoid JS error when PF autocall list buttons
window.clickVinc = window.onList = window.clickList = globalThis.void;
export default new List();
