
import DataList from "../../../components/inputs/DataList.js";
import presto from "../../model/Presto.js";

export default class Memoria extends DataList {
	setEditable() {
		this.parentNode.setVisible(presto.isUae() && presto.isGcr());
		this.setReadonly(!presto.isEditableUae());
	}
}
