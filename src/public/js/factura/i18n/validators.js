
import Validators from "../../i18n/validators.js";
import factura from "../model/Factura.js";
import lineas from "../modules/lineas.js";
import form from "../../xeco/modules/solicitud.js";

class FacturaValidators extends Validators {
	success(data) { form.closeAlerts(); this.reset(); return data; } // Succesful validations
	fail(msg) { form.setErrors(super.fail(msg)); return !this.reset(); } // force error for validation

	factura(data) { 
		this.isKey("acTercero", data.idTer, "Debe seleccionar un tercero válido"); // autocomplete required key
		this.isKey("delegacion", data.idDel, "Debe seleccionar una delegación del tercero"); // desplegable de las delegaciones
		this.isKey("acOrganica", data.idOrg, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
		if (factura.isRecibo()) //subtipo = ttpp o extension
			this.size("acRecibo", data.acRecibo, "Debe indicar un número de recibo válido");
		/*if (factura.isDeportes()) {
			this.size("extra", data.extra, "errRequired", "Debe indicar un número de recibo válido"); // Required string
			this.leToday("fMax", data.fMax, "Debe indicar la fecha del recibo asociado"); // Required date
		}*/
		if (factura.isTtppEmpresa()) // Required string
			this.size("memo", data.memo, "Debe indicar las observaciones asociadas a la factura.");
		if (factura.isFace())
			this.word20("og", data.og).word9("oc", data.oc).word9("ut", data.ut).word10("op", data.op);
		if (factura.isPlataforma())
			this.size("og", data.og);
		return this.close(data);
	}

	all() {
		const data = form.getData(); // start validation
		if (lineas.isEmpty()) { // minimo una linea
			const msg = "Debe detallar los conceptos asociados a la solicitud.";
			this.addError("desc", "errRequired", msg).addError("acTTPP", "errRequired", msg);
		}
        return this.factura(data);
	}

	linea() {
		const data = form.getData(); // start validation
		this.gt0("imp", data.imp); // float required
		this.size("desc", data.desc); // string required
		return this.close(data, "El concepto indicado no es válido!"); // Main form message
	}
}

export default new FacturaValidators();
