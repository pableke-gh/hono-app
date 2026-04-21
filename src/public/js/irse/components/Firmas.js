
import firma from "../../core/model/Firma.js";
import observer from "../../core/util/Observer.js";
import irse from "../model/Irse.js";

export default class FirmasBlock extends HTMLDivElement {
	static #first; // main block

	render = firmas => { // render div contents
		if (!firmas) return this.hide(); // hide all firmas
		if (!Array.isArray(firmas)) return this.show(); // show firmas

		// build new contents
		this.children[2].innerHTML = firmas.slice(1).map(firma.render).join("");
		const rechazo = irse.isInvalidada() && firmas.find(firma.isRechazada);
		if (rechazo) { // rechazado o cancelado
			rechazo.rejectedBy = firma.getNombre(rechazo);
			this.children[3].render(rechazo);
		}
		else
			this.children[3].hide();
		this.show(); // show block
	}

	clone = () => { // clone styles and contents
		this.className = FirmasBlock.#first.className;
		this.innerHTML = FirmasBlock.#first.innerHTML;
	}

	connectedCallback() { // initialize firmas
		if (FirmasBlock.#first) // firmas pre-calculated
			observer.subscribe("firmas-updated", this.clone);
		else {
			FirmasBlock.#first = this; // render once
			observer.subscribe("firmas-updated", this.render);
		}
	}
}
