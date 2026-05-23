
import api from "../../../components/Api.js";
import presto from "../../model/Presto.js";
import ButtonForm from "../../../components/inputs/ButtonForm.js";

export default class Adjunto extends ButtonForm {
	execute() {
		if (presto.getAdjunto()) // download or view file
			api.init().blob("/uae/presto/adjunto?id=" + presto.getAdjunto());
		else if (presto.isEditable())
			this.nextElementSibling.click(); // trigger file input
	}

	setModeAdjunto() {
		this.innerHTML = 'Documentación Adjunta<i class="far fa-paperclip"></i>';
		this.title = "Descargar / visualizar la documentación asociada";
		return this.show();
	}
	setModeSelect() {
		this.innerHTML = '<i class="fas fa-search"></i>Adjuntar Documentación';
		this.title = "Documentación asociada a la solicitud";
		return this.show();
	}
	setEditable() {
		if (presto.getAdjunto())
			return this.setModeAdjunto();
		if (presto.isEditable())
			return this.setModeSelect();
		return this.hide();
	}
}
