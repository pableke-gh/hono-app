
import valid from "../../i18n/validators.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class AddLinea extends ButtonForm {
	execute() {
		form.closeAlerts(); // hide prev. errors
		if (factura.isTtppEmpresa()) { // tipo recibo ttpp
			const ttpp = form.getElement("ttpp"); // autocomplete ttpp
			form.getLineas().addRecibo(ttpp.getCurrentItem());
			return ttpp.reload();
		}
		form.getLineas().addLinea(valid.linea());
	}
}
