
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import observer from "../../../core/util/Observer.js";

import irse from "../../model/Irse.js";
import form from "../irse.js";

export default class Interesado extends AutocompleteHTML {
	connectedCallback() { // Initialize element after form
		this.setDelay(600).setMinLength(5);
		observer.subscribe("perfil", () => {
			const div = this.parentNode.nextElementSibling;
			div.firstElementChild.textContent = irse.getColectivo();
			div.lastElementChild.setVisible(irse.getEmailInteresado());
			div.lastElementChild.setAttribute("href", "mailto:" + irse.getEmailInteresado());
			div.setVisible(irse.getColectivo());
		});
	}

	source() { api.init().json("/uae/iris/interesados", { term: this.value }).then(this.render); }
	row(item) { return (item.nif + " - " + item.nombre); }
	select(item) {
		observer.emit("perfil", irse.setInteresado(item));
		return item.nif;
	}

	validate = () => (this.isLoaded() ? this.setOk() : !this.setRequired("errPerfil"));
	reset() {
		irse.setInteresado();
		observer.emit("perfil", irse);
		return super.reset();
	}

	setInteresado() {
		const interesado = irse.getInteresado(); // read interesado from response
		if (!interesado) // creating new instance
			return this.clear(); // clear previous data
		this.setValue(interesado.nif, this.row(interesado));
		observer.emit("perfil", irse);
	}
}
