
import DataList from "../../../components/inputs/DataList.js";

export default class EconomicaInc extends DataList {
	addFormData() {} // not append values in form data
	setEditable() { return this; } // preserve state always editable

	connectedCallback() { // default initialization
		this.setEmptyOption("lblSelectEco");
	}
}
