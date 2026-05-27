
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import observer from "../../../core/util/Observer.js";
import irse from "../../model/Irse.js";

export default class Interesado extends AutocompleteHTML {
	connectedCallback() { // Init. element
		this.setDelay(600).setMinLength(5);
		observer.subscribe("interesado", interesado => {
			observer.emit("perfil", irse.setInteresado(interesado)); // propague event
			const div = this.parentNode.nextElementSibling; // info element
			div.lastElementChild.setVisible(interesado.email);
			div.lastElementChild.setAttribute("href", "mailto:" + interesado.email);
			div.firstElementChild.textContent = irse.getColectivo();
			div.setVisible(irse.getColectivo());
		});
	}

	load() { return this; } // not to load on view
	source() { api.init().json("/uae/iris/interesados", { term: this.value }).then(this.render); }
	row(item) { return (item.nif + " - " + item.nombre); }
	select(item) {
		observer.emit("interesado", item);
		return item.nif;
	}

	setEditable() { this.setDisabled(!irse.isEditableP0()); }
	validate = () => (this.isLoaded() ? this.setOk() : !this.setRequired("errPerfil"));
	reset() {
		observer.emit("perfil", irse.setInteresado());
		this.parentNode.nextElementSibling.hide();
		return super.reset();
	}

	setInteresado(interesado) {
		if (!interesado) // creating new instance
			return this.clear(); // clear previous data
		irse.setInteresado(interesado); // load new data
		this.setValue(interesado.nif, this.row(interesado));
		observer.emit("interesado", interesado);
	}
}
