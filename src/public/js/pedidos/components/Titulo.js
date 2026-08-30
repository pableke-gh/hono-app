
import observer from "../../core/util/Observer.js";
import pedido from "../model/Pedido.js";

export default class TituloH2 extends HTMLHeadingElement {
	connectedCallback() {
		observer.subscribe("pedido", () => {
			this.innerHTML = pedido.getTitulo() + ` <i>${pedido.getCodigo() || ""}</i>`;
		});
	}
}
