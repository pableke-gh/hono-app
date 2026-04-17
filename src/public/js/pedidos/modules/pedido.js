
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import pedido from "../model/Pedido.js";
import Proveedor from "../components/Proveedor.js";
import Categoria from "../components/Categoria.js";
import Organica from "../components/Organica.js";

export default class PedidoForm extends FormHTML {
	#setImportes() {
		this.setValue("impIva", pedido.getImpIva()).setValue("impTotal", pedido.getImpTotal())
			.setValue("prorrata", pedido.getProrrata()).setValue("impPpto", pedido.getImpPpto());
	}

	connectedCallback() {
		this.set("filename", (el, input) => el.setText(input.getFilename()));
		tabs.setAction("adjunto", () => api.init().blob("/uae/pedidos/adjunto?id=" + pedido.getAdjunto()));

		this.getElement("imp").addChange(ev => { pedido.setImporte(ev.target.getValue("imp")); this.#setImportes(); });
		this.getElement("iva").addChange(ev => { pedido.setIva(+ev.target.value); this.#setImportes(); });

		this.onSubmit(ev => {
			if (super.validate() && i18n.confirm("msgSend")) // validate and user confirmation
				api.setFormData(this.getFormData()).json("/uae/pedido/save").then(tabs.showInit);
			ev.preventDefault(); // ajax interceptor
		});
	}

	create = () => this.view({ imp: 0, iva: 0 });
	view = data => {
		this.load(pedido.setData(data));
		this.#setImportes();
		tabs.showForm();
	}
}

customElements.define("proveedor-input", Proveedor, { extends: "input" });
customElements.define("categoria-pedido", Categoria, { extends: "select" });
customElements.define("organica-input", Organica, { extends: "input" });
