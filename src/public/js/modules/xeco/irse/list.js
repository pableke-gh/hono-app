
import dom from "../../../components/DomBox.js";
import Form from "../../../components/Form.js";
//import dt from "../../../components/DateBox.js";
import i18n from "../../../i18n/langs.js";

function List() {
	const self = this; //self instance

	//const sysdate = new Date(); // current date
	//const mindate = dt.addDays(sysdate, -9).isoDate(sysdate); // ultimos 10 dias

	this.init = () => {
		const formList = new Form("#xeco-filtro"); // Current form
		window.clickVinc = () => formList.reset(".ui-filter").setval("#estado", "1").click("#filter-list");
		window.onList = () => formList.reset(".ui-filter").setval("#firma", "5").loading();
		window.clickList = () => window.onList().click("#filter-list");
		//window.onListAll = () => formList.reset(".ui-filter").setval("#f-min", mindate).loading();
		i18n.set("fCache", (new Date()).addDays(-1).toISOString()); // fecha de la cache
		return self;
	}
}

// avoid JS error when PF autocall list buttons
window.clickVinc = window.onList = window.clickList = globalThis.void;
export default new List();