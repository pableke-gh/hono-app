
import observer from "../../core/util/Observer.js";
import irse from "../model/Irse.js";

export default class TituloH2 extends HTMLHeadingElement {
	connectedCallback() {
		observer.subscribe("solicitud", () => {
			this.innerHTML = irse.getTitulo() + ` <i>${irse.getCodigo()}</i>`;
		});
	}
}
