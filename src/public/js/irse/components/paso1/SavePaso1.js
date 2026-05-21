
import valid from "../../i18n/validators/rutas.js";
import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import perfil from "../../modules/tabs/perfil.js";
import paso1 from "../../modules/tabs/paso1.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class SavePaso1 extends ButtonForm {
	setEditable() {
		this.setVisible(irse.isEditable());
		this.setDisabled(!irse.isEditable());
	}

	execute() {
		if (!valid.paso1()) return; // if error => stop
		if (!form.isChanged()) return form.setOk(); // nada que guardar
		const promise = perfil.isMun() ? paso1.saveMun() : paso1.save();
		promise.then(form.setOk);
	}

}
