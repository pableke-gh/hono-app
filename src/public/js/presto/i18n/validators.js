
import sb from "../../components/types/StringBox.js";
import Validators from "../../core/i18n/validators.js";
import presto from "../model/Presto.js";
import form from "../modules/presto.js";

class PrestoValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation
	rechazar() { return super.rechazar(form.getData()); } // specific implementation

	presto = data => {
		if (presto.isPartidaDec()) { // valido la partida a disminuir
			this.isKey("orgDec", data.orgDec, "Debe seleccionar la orgánica que disminuye"); // autocomplete required key
			this.isKey("ecoDec", data.ecoDec, "Debe seleccionar la económica que disminuye"); // select required number
		}
		const imp = data.impDec ?? 0; // los importes pueden ser nulos segun el tipo de presto
		const notValidateCd = presto.isAnt() || presto.isSubsanable(); // anticipos / subsanaciones no validan el CD
		const cd = notValidateCd ? imp : (data.cd ?? 0); // validación del crédito disponible
		if (imp > cd)
			this.addError("impDec", "errExceeded", "El importe de la partida que disminuye supera el crédito disponible");
		this.size("memo", data.memo, "Debe asociar una memoria justificativa a la solicitud."); // Required string
		if (data.urgente == "2") { // Solicitud urgente
			this.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta solicitud."); // Required string
			this.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta solicitud."); // Required date
		}
		return this.close(data);
	}

	all() {
		const data = form.getData(); // start validation
		const partidas = form.getPartidas(); // paartidas de la solicitud
		if (presto.isPartidaDec() && (partidas.getImporte() != data.impDec)) // Valido los importes a decrementar e incrementar
			this.addError("impDec", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
		if (partidas.isEmpty())
			this.addRequired("orgInc", "Debe seleccionar al menos una partida a incrementar");
        return this.presto(data);
    }

	partidaInc() {
		const data = form.getData(); // start validation
		this.isKey("orgInc", data.orgInc, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
		this.isKey("ecoInc", data.ecoInc, "Debe seleccionar una económica"); // select required number
		this.gt0("impInc", data.impInc); // float number > 0
		if (form.getPartidas().getData().find(row => ((row.idOrg == data.orgInc) && (row.idEco == data.ecoInc))))
			this.addError("orgInc", "notAllowed", "¡Partida ya asociada a la solicitud!"); // partida ya asociada
		else if ((data.orgDec == data.orgInc) && sb.starts(sb.getCode(form.getOptionText("ecoInc")), sb.getCode(form.getOptionText("ecoDec"))))
			this.addError("orgInc", "notValid", "La partida a incrementar esta dentro del nivel vinculante de la partida a decrementar. Por lo que no es necesario realizar esta operación.");
		return this.close(data, "No ha seleccionada correctamente la partida a incrementar.");
	}
	partidaSrv(partida) {
		return partida ? this.success(partida) : this.addRequired("orgInc", "Partida a incrementar no encontrada en el sistema.").fail();
	}

	validate030() {
		const data030 = form.getData(".ui-030"); // start validation
		const p080 = form.getPartidas().getCurrentItem(); // current partida 080
		if (!p080) // Debo cargar previamente la partida seleccionada
			return this.fail("No se ha encontrado la partida asociada al documento 080.");
		const ERR_ORGANICA = "No ha seleccionado correctamente la orgánica";
		this.isKey("org030", data030.org030, ERR_ORGANICA); // autocomplete required key
		this.isKey("eco030", data030.eco030, "Debe seleccionar una económica"); // select required number
		this.gt0("imp030", data030.imp030); // float number > 0
		const label = form.getElement("org030").split(" - ");
		if (sb.isEmpty(label)) // Code separator
			return this.addError("org030", ERR_ORGANICA, "No ha seleccionada correctamente la aplicación para el DC 030.").fail();
		if (p080.imp < data030.imp030)
			return this.addError("imp030", "errExceeded", "El importe del documento 030 excede al del 080.").fail();

		// If ok => update partida a incrementar
		p080.org030 = +data030.org030;
		[ p080.o030, p080.dOrg030 ] = label;
		p080.eco030 = data030.eco030;
		p080.imp030 = data030.imp030;
		return this.close(data030);
	}
}

export default new PrestoValidators();
