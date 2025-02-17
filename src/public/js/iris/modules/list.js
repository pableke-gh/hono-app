
import Form from "../../components/Form.js";

function List() {
	const self = this; //self instance

	this.init = () => {
		const formList = new Form("#xeco-filtro"); // Current form
		window.clickVinc = () => formList.reset(".ui-filter").setval("#estado", "1").click("#filter-list");
		window.onList = () => formList.reset(".ui-filter").setval("#firma", "5").loading();
		window.clickList = () => window.onList().click("#filter-list");
		window.onListAll = () => formList.reset(".ui-filter").loading();
		return self;
	}
}

// avoid JS error when PF autocall list buttons
window.clickVinc = window.onList = window.clickList = window.onListAll = globalThis.void;
export default new List();
