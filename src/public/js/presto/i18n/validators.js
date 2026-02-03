
import sb from "../../components/types/StringBox.js";
import Validators from "../../i18n/validators.js";
import presto from "../model/Presto.js";
import partidas from "../modules/partidas.js";
import form from "../../xeco/modules/solicitud.js";

class PrestoValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation

	presto = data => {
		if (presto.isPartidaDec()) { // valido la partida a disminuir
			this.isKey("acOrgDec", data.idOrgDec, "Debe seleccionar la orgánica que disminuye"); // autocomplete required key
			this.isKey("idEcoDec", data.idEcoDec, "Debe seleccionar la económica que disminuye"); // select required number
		}
		const imp = data.imp ?? 0; // los importes pueden ser nulos segun el tipo de presto
		const notValidateCd = presto.isAnt() || presto.isSubsanable(); // anticipos / subsanaciones no validan el CD
		const cd = notValidateCd ? imp : (data.cd ?? 0); // validación del crédito disponible
		if (imp > cd)
			this.addError("imp", "errExceeded", "El importe de la partida que disminuye supera el crédito disponible");
		this.size("memo", data.memo, "Debe asociar una memoria justificativa a la presto."); // Required string
		if (data.urgente == "2") { // Solicitud urgente
			this.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta presto."); // Required string
			this.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta presto."); // Required date
		}
		return this.close(data);
	}

	all() {
		const data = form.getData(); // start validation
		if (presto.isPartidaDec() && (partidas.getImporte() != data.imp)) // Valido los importes a decrementar e incrementar
			this.addError("imp", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
		if (partidas.isEmpty())
			this.addRequired("acOrgInc", "Debe seleccionar al menos una partida a incrementar");
        return this.presto(data);
    }

	partidaInc() {
		const data = form.getData(); // start validation
		this.isKey("acOrgInc", data.idOrgInc, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
		this.isKey("idEcoInc", data.idEcoInc, "Debe seleccionar una económica"); // select required number
		this.gt0("impInc", data.impInc); // float number > 0
		if (partidas.getData().find(row => ((row.idOrg == data.idOrgInc) && (row.idEco == data.idEcoInc))))
			this.addError("acOrgInc", "notAllowed", "¡Partida ya asociada a la solicitud!"); // partida ya asociada
		else if ((data.idOrgDec == data.idOrgInc) && sb.starts(sb.getCode(form.getOptionText("#idEcoInc")), sb.getCode(form.getOptionText("#idEcoDec"))))
			this.addError("acOrgInc", "notValid", "La partida a incrementar esta dentro del nivel vinculante de la partida a decrementar. Por lo que no es necesario realizar esta operación.");
		return this.close(data, "No ha seleccionada correctamente la partida a incrementar.");
	}
	partidaSrv(partida) {
		return partida ? this.success() : this.addRequired("acOrgInc", "Partida a incrementar no encontrada en el sistema.").fail();
	}

	validate030() {
		const data030 = form.getData(".ui-030"); // start validation
		const p080 = partidas.getCurrentItem(); // current partida 080
		if (!p080) // Debo cargar previamente la partida seleccionada
			return !this.setError("No se ha encontrado la partida asociada al documento 080.");
		const ERR_ORGANICA = "No ha seleccionado correctamente la orgánica";
		this.isKey("acOrg030", data030.idOrg030, ERR_ORGANICA); // autocomplete required key
		this.isKey("idEco030", data030.idEco030, "Debe seleccionar una económica"); // select required number
		this.gt0("imp030", data030.imp030); // float number > 0
		const label = data030.acOrg030?.split(" - ");
		if (!label) // Code separator
			return !this.addError("acOrg030", ERR_ORGANICA, "No ha seleccionada correctamente la aplicación para el DC 030.");
		if (p080.imp < data030.imp030)
			return !this.addError("imp030", "errExceeded", "El importe del documento 030 excede al del 080.");

		// If ok => update partida a incrementar
		p080.idOrg030 = +data030.idOrg030;
		[ p080.o030, p080.dOrg030 ] = label;
		p080.idEco030 = data030.idEco030;
		p080.imp030 = data030.imp030;
		return this.close(data030);
	}
}

export default new PrestoValidators();
