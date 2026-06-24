
import api from "../../../core/components/Api.js";
import ButtonForm from "../../../core/components/forms/ButtonForm.js";
import pedido from "../../model/Pedido.js";

export default class Adjunto extends ButtonForm {
	execute() {
		if (pedido.getAdjunto()) // download or view file
			api.init().blob("/uae/pedidos/adjunto?id=" + pedido.getAdjunto());
		else if (pedido.isEditable())
			this.nextElementSibling.click(); // trigger file input
	}

	setModeAdjunto() {
		this.innerHTML = 'Presupuesto Adjunto<i class="far fa-paperclip"></i>';
		this.title = "Descargar / visualizar la documentación asociada";
		return this.show();
	}
	setModeSelect() {
		this.innerHTML = '<i class="fas fa-search"></i>Adjuntar Presupuesto';
		this.title = "Presupuesto del proveedor";
		return this.show();
	}
	setEditable() {
		if (pedido.getAdjunto())
			return this.setModeAdjunto();
		if (pedido.isEditable())
			return this.setModeSelect();
		return this.hide();
	}
}
