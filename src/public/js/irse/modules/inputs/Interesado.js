
import AutocompleteHTML from "../../../components/inputs/AutocompleteHTML.js";
import api from "../../../components/Api.js";
import irse from "../../model/Irse.js";
import form from "../irse.js";

export default class Interesado extends AutocompleteHTML {
	init() { // Initialize element after form
		this.setDelay(600).setMinLength(5);
		form.set("update-colectivo", el => {
			el.firstElementChild.textContent = irse.getColectivo();
			el.lastElementChild.setAttribute("href", "mailto:" + irse.getEmailInteresado());
			el.setVisible(irse.getColectivo());
		});
	}

	source() { api.init().json("/uae/iris/interesados", { term: this.value }).then(this.render); }
	row(item) { return (item.nif + " - " + item.nombre); }
	select(item) {
		irse.setInteresado(item);
		form.setValue("nif-interesado", item.nif);
		form.getPerfil().update();
		return item.nif;
	}

	validate = () => (this.isLoaded() ? this.setOk() : !this.setRequired("errPerfil"));
	reset() {
		irse.setInteresado();
		form.setValue("nif-interesado").refresh(irse);
		return super.reset();
	}

	setInteresado() {
		const interesado = irse.getInteresado(); // read interesado from response
		if (!interesado) return this.clear(); // creating new instance
		this.setValue(interesado.nif, this.row(interesado));
		form.setValue("nif-interesado", this.getValue());
	}
}
