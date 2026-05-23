
import TextArea from "../../../components/inputs/TextArea.js";
import presto from "../../model/Presto.js";

export default class Memoria extends TextArea {
	setEditable() {
		this.parentNode.setVisible(!presto.isL83());
		this.setReadonly(!presto.isEditable());
	}
}
