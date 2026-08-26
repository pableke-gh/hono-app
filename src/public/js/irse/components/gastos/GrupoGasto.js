
import i18n from "../../../core/i18n/langs.js";

export default class GrupoGasto extends HTMLDivElement {
	hide() { this.classList.add("hide"); }
	show() { this.classList.remove("hide"); }
	setVisible(visible) { visible ? this.show() : this.hide(); }

	reset() { this.children.mask(0b000001); } // hide fields
	setDefault() { this.children.mask(0b000011); } // show select
	setTicket() { this.children.mask(0b100111); } // tickets subgroup
	setTaxi() {
		const label = document.forms.solicitud.elements.txtGasto;
		label.previousElementSibling.innerText = i18n.get("lblDescTaxi");
		this.children.mask(0b101111);
	}

	setPernocta() { this.children.mask(0b110111); }
	setExtra() { this.children.mask(0b101111); }
	setDoc() {
		const label = document.forms.solicitud.elements.txtGasto;
		label.previousElementSibling.innerText = i18n.get("lblDescObserv");
		this.children.mask(0b101011);
	}
}
