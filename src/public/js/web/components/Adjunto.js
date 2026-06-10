
import ButtonForm from "../../components/inputs/ButtonForm.js";

export default class Adjunto extends ButtonForm {
	execute() {
		this.nextElementSibling.click(); // trigger file input
	}
}
