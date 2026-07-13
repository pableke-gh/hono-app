
import tabs from "../../../core/components/tabs/TabsOld.js";
import valid from "../../i18n/validators/rutas.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import perfil from "../../modules/tabs/perfil.js";
import paso1 from "../../modules/tabs/paso1.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class NextPaso1 extends ButtonForm {

	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		if (!valid.paso1()) return; // if error => stop
		if (!irse.isEditable() || !form.isChanged())
			return tabs.next(); // go next tab directly
		const promise = perfil.isMun() ? paso1.saveMun() : paso1.save();
		promise.then(() => tabs.goTo());
	}

}
