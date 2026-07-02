
import api from "../../core/components/Api.js"
import ButtonForm from "../../core/components/forms/ButtonForm.js"

export default class ButtonSave extends ButtonForm {
	execute() {
		api.init().json("/uae/ttpp/save").then(this.hide); // read params from sesion => loaded by /uae/ttpp/load
	}
}
