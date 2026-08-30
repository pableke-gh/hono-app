
import observer from "../../core/util/Observer.js";
import beca from "../model/Beca.js";

export default class TituloH2 extends HTMLHeadingElement {
	connectedCallback() {
		observer.subscribe("beca", () => {
			this.innerHTML = beca.getTitulo() + ` <i>${beca.getCodigo() || ""}</i>`;
		});
	}
}
