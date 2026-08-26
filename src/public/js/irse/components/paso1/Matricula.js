
import sb from "../../../components/types/StringBox.js";
import TextInput from "../../../components/inputs/TextInput.js";
import irse from "../../model/Irse.js";

// actualiza el campo matricula del paso 1 (municipio) y el del paso 2 (rutas)
export default class Matricula extends TextInput {
	setEditable() {
		this.setReadonly(!irse.isEditable());
	}

	connectedCallback() {
		this.addChange(ev => {
			ev.target.value = sb.toUpperWord(ev.target.value);
			irse.setMatricula(ev.target.value);
		});
	}
}
