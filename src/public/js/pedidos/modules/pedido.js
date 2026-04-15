
import FormHTML from "../../components/forms/FormHTML.js";
import pedido from "../model/Pedido.js";

import Categoria from "../components/Categoria.js";
import Organica from "../components/Organica.js";

export default class PedidoForm extends FormHTML {
	connectedCallback() {
		this.getElement("adjunto").onFile((ev, el, file) => { el.nextElementSibling.innerHTML = file.name; });

		this.onSubmit(ev => {
			//todo: api upload multipart form
		});
	}

	view() {
	}
}

customElements.define("categoria-pedido", Categoria, { extends: "select" });
customElements.define("organica-input", Organica, { extends: "input" });
