
import Table from "../../components/Table.js";
import i18n from "../../i18n/langs.js";

import factura from "../model/Factura.js";
import linea from "../model/Linea.js";
import form from "../../xeco/modules/SolicitudForm.js";

class Lineas extends Table {
	constructor() {
		super(form.querySelector("#lineas-fact"), linea.getTable());
		this.setAfterRender(resume => {
			resume.impIva = resume.imp * (factura.getIva() / 100);
			resume.impTotal = resume.imp + resume.impIva; // total conceptos + importe iva
		});
	}

	validate = data => {
		if (this.size() == 0) { // minimo una linea
			const valid = i18n.getValidators(); // Init. validation
			const msg = "Debe detallar los conceptos asociados a la solicitud.";
			valid.addError("desc", "errRequired", msg).addError("acTTPP", "errRequired", msg);
		}
        return factura.validate(data);
	}
}

export default new Lineas();
