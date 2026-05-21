
import i18n from "../../../i18n/langs.js";

export default class GrupoGasto extends HTMLDivElement {
	#lblDescripcion = this.querySelector(".label-text-gasto");

	reset() { this.children.mask(0b000001); } // hide fields
	setDefault() { this.children.mask(0b000011); } // show select
	setTicket() { this.children.mask(0b100111); } // tickets subgroup
	setTaxi() {
		this.#lblDescripcion.innerText = i18n.get("lblDescTaxi");
		this.children.mask(0b101111);
	}

	setPernocta() { this.children.mask(0b110111); }
	setExtra() { this.children.mask(0b101111); }
	setDoc() {
		this.#lblDescripcion.innerText = i18n.get("lblDescObserv");
		this.children.mask(0b101011);
	}
}
