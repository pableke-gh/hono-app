
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import i18n from "../i18n/langs.js";
import firma from "../../core/model/Firma.js";
import observer from "../../core/util/Observer.js";

import pedido from "../model/Pedido.js";
import Proveedor from "../components/Proveedor.js";
import Categoria from "../components/Categoria.js";
import Organica from "../components/Organica.js";
import Firmas from "../components/Firmas.js";

export default class PedidoForm extends FormHTML {
	#setImportes() {
		this.setValue("impIva", pedido.getImpIva()).setValue("impTotal", pedido.getImpTotal())
			.setValue("prorrata", pedido.getProrrata()).setValue("impPpto", pedido.getImpPpto());
	}

	connectedCallback() { // initialize form
		this.set("filename", (el, input) => el.setText(input.getFilename()));
		tabs.setAction("adjunto", () => api.init().blob("/uae/pedidos/adjunto?id=" + pedido.getAdjunto()));

		this.addChange("imp", ev => { pedido.setImporte(ev.target.getValue("imp")); this.#setImportes(); });
		this.addChange("iva", ev => { pedido.setIva(+ev.target.value); this.#setImportes(); });

		this.onSubmit(ev => {
			if (super.validate() && i18n.confirm("msgSend")) // validate and user confirmation
				api.setFormData(this.getFormData()).json("/uae/pedido/save").then(tabs.showInit);
			ev.preventDefault(); // ajax interceptor
		});
	}

	#load(data, firmas) {
		this.load(pedido.setData(data)).#setImportes();
		observer.emit("firmas-updated", firmas);
		tabs.showForm(); // show form tab
	}

	create = () => this.#load({ imp: 0, iva: 0 });
	view = data => {
		if (this.isCached(data.id)) // check if data is cached
			return this.#load(data, true); // go form tab directly
		const url = "/uae/pedidos/view?id=" + data.id; // resource
		api.init().json(url).then(firmas => this.#load(data, firmas));
	}

	firmar = () => { // final arrow function
		const url = "/uae/pedidos/firmar?id=" + pedido.getId();
		const fnThen = () => { pedido.setProcesando(); observer.emit("pedido-close"); }
		i18n.confirm("msgFirmar") && api.init().json(url).then(fnThen);
	}
	rechazar = () => { // accion de rechazo post reject
		const el = this.getElement("rechazo"); // textarea input
		if (!el.validate() || !i18n.confirm("msgRechazar")) return; // validation error or cancel by user
		const params = { id: pedido.getId(), rechazo: el.getValue() }; // url params
		const fnThen = () => { pedido.setRechazada(); observer.emit("pedido-close"); }
		api.init().json("/uae/pedidos/rechazar", params).then(fnThen);
	}
	cancelar = () => { // accion de cancelacion post reject
		const el = this.getElement("rechazo"); // textarea input
		if (!el.validate() || !i18n.confirm("msgCancelar")) return; // validation error or cancel by user
		const params = { id: pedido.getId(), rechazo: el.getValue() }; // url params
		const fnThen = () => { pedido.setCancelada(); observer.emit("pedido-close") }
		api.init().json("/uae/pedidos/cancelar", params).then(fnThen);
	}
}

customElements.define("proveedor-input", Proveedor, { extends: "input" });
customElements.define("categoria-pedido", Categoria, { extends: "select" });
customElements.define("organica-input", Organica, { extends: "input" });
customElements.define("firmas-block", Firmas, { extends: "div" });
