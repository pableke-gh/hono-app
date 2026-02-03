
import Table from "../../components/Table.js";
import factura from "../model/Factura.js";
import linea from "../model/Linea.js";
import form from "../../xeco/modules/solicitud.js";

class Lineas extends Table {
	constructor() {
		super(form.querySelector("#lineas-fact"), linea.getTable());
		this.setAfterRender(resume => {
			resume.impIva = resume.imp * (factura.getIva() / 100);
			resume.impTotal = resume.imp + resume.impIva; // total conceptos + importe iva
		});
	}
}

export default new Lineas();
