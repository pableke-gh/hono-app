
import firma from "../model/Firma.js";
import firmas from "../model/Firmas.js";
import observer from "../util/Observer.js";

export default class FirmasBlock extends HTMLDivElement {
	static #first; // main block

	render = data => { // render div contents
		if (!data) return this.hide(); // hide all firmas
		if (!Array.isArray(data)) return this.show(); // show cache

		// build new contents
		firmas.setFirmas(data); // set new firmas array
		this.children[2].innerHTML = firmas.render();
		const rechazo = firmas.getRechazada(); // get rechazo
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
