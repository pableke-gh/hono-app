
import Table from "../../components/Table.js";
import i18n from "../i18n/langs.js";

import presto from "../model/Presto.js";
import partida from "../model/Partida.js";
import p030 from "./partida030.js";
import form from "../../xeco/modules/SolicitudForm.js";

class Partidas extends Table {
	constructor() {
		super(form.querySelector("#partidas-inc"), partida.getTable());
		this.setAfterRender(() => form.setEditable(presto)).set("#doc030", p030.view);
		presto.showPartidasInc = () => (presto.isTipoMultipartida() && presto.isEditable() && (this.size() < 20));
	}

	getImporte = () => this.getProp("imp");
	setPrincipal = () => {
		const data = this.getData();
		data.sort((a, b) => (b.imp - a.imp)); //orden por importe desc.
		partida.setPrincipal(data[0]); // marco la primera como principal
		return this;
	}

	validate = data => {
		const valid = i18n.getValidators(); // Init. validation
		if (presto.isPartidaDec() && (this.getImporte() != data.imp)) // Valido los importes a decrementar e incrementar
			valid.addError("imp", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
		if (this.size() == 0)
			valid.addRequired("acOrgInc", "Debe seleccionar al menos una partida a incrementar");
        return presto.validate(data);
    }
	validatePartida = partida => { // compruebo si la partida existía previamente
		const valid = i18n.getValidation(); // Continue with validation without reset
		if (!partida)
			return !valid.addRequired("acOrgInc", "Partida a incrementar no encontrada en el sistema.");
		return this.getData().find(row => ((row.o == partida.o) && (row.e == partida.e)))
			? !valid.addError("acOrgInc", "notAllowed", "¡Partida ya asociada a la solicitud!")
			: true;
	}
}

export default new Partidas();
