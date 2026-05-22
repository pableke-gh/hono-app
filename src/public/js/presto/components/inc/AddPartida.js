
import api from "../../../components/Api.js"
import valid from "../../i18n/validators.js";

import form from "../../modules/presto.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js"

export default class AddPartidaInc extends ButtonForm {
	execute() {
		if (!valid.partidaInc()) return; // errores al validar los campos de entrada
		const organica = form.getElement("orgInc"); // organica a incrementar
		const url = `/uae/presto/partida/add?org=${organica.getValue()}&eco=${form.getValue("ecoInc")}`;
		api.init().json(url).then(partidaInc => { // fetch partida a incrementar
			if (!valid.partidaSrv(partidaInc)) return; // error en la partida a incrementar
			partidaInc.imp030 = partidaInc.imp = form.getValue("impInc"); // Importe de la partida a añadir
			form.getPartidas().add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
			organica.reload(); // reseteo los valores del sub-formulario
		});
	}
}
