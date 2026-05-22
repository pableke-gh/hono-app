
import api from "../../../components/Api.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";
import observer from "../../../core/util/Observer.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class AddAllRecibos extends ButtonForm {
	setEditable() {
		this.setVisible(factura.isTtppEmpresa());
		this.setDisabled(!factura.isTtppEmpresa());
	}

	execute() {
		form.closeAlerts(); // hide prev. errors
		const id = form.getValue("organica"); // pk
		if (!id) // el campo organica es obligatorio!
			return form.setRequired("organica", "Debe asociar una orgánica a esta solicitud.");
		if (confirm("¿Confirma que desea añadir todos los recibos a la solicitud?")) // cancel by user?
			api.init().json("/uae/ttpp/recibos/all?id=" + id).then(form.getLineas().addRecibos);
	}

	connectedCallback() { // init. component
		super.connectedCallback(); // call parent method to set default behavior
		observer.subscribe("form-update", () => this.setEditable()); // update button state on pedido changes
	}
}
