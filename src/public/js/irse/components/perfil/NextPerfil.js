
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators/irse.js";
import observer from "../../../core/util/Observer.js";

import irse from "../../model/Irse.js";
import form from "../../modules/irse.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class NextPerfil extends ButtonForm {

	setEditable() {
		this.setDisabled(false); // always enabled
	}

	execute() {
		if (!valid.perfil()) return; // if error => stop
		if (!irse.isEditableP0()) // is form readonly?
			return tabs.next(); // go next without saving

		const data = form.getData(".ui-perfil");
		data.financiacion = irse.getFinanciacion();
		data.organicas = form.getElement("organica").getOrganicas().getData();
		api.setJSON(data).json("/uae/iris/perfil/save").then(data => {
			irse.setData(data.solicitud); // update irse data
			observer.emit("perfil", irse); // update changes from server (id, fk, text, etc.)
			form.getPaso1().view(data.firmas); // update paso1 and firmas list
			form.getPaso9().setCuentas(data.cuentas); // cuentas del interesado (desplegable paso9)
			form.reactivate(irse).nextTab(1); // prepare changes and show tab
		});
	}

}
