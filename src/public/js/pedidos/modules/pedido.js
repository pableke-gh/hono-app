
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import i18n from "../i18n/langs.js";
import observer from "../../core/util/Observer.js";

import pedido from "../model/Pedido.js";
import Referencia from "../components/Referencia.js";
import Proveedor from "../components/Proveedor.js";
import Categoria from "../components/Categoria.js";
import Aplicacion from "../components/Aplicacion.js";
import Firmas from "../components/Firmas.js";

export default class PedidoForm extends FormHTML {
	#setImportes() {
		this.setValue("impIva", pedido.getImpIva()).setValue("impTotal", pedido.getImpTotal())
			.setValue("prorrata", pedido.getProrrata()).setValue("impPpto", pedido.getImpPpto());
	}

	connectedCallback() { // initialize form
		this.set("filename", (el, input) => el.setText(input.getFilename()));
		tabs.setAction("adjunto", () => api.init().blob("/uae/pedidos/adjunto?id=" + pedido.getAdjunto()));

		this.addChange("imp", ev => { pedido.setImporte(ev.target.getValue()); this.#setImportes(); });
		this.addChange("iva", ev => { pedido.setIva(+ev.target.value); this.#setImportes(); });

		this.onSubmit(ev => {
			if (super.validate() && i18n.confirm("msgSend")) // validate and user confirmation
				api.setFormData(this.getFormData()).json("/uae/pedidos/save").then(tabs.showInit);
			ev.preventDefault(); // ajax interceptor
		});
	}

	#load(data, firmas) {
		this.load(pedido.setData(data)).#setImportes();
		observer.emit("firmas-updated", firmas);
		tabs.showForm(); // show form tab
	}

	create = () => this.#load({ imp: 0, iva: 21 });
	view = pedido => {
		if (this.isCached(pedido.id)) // check if data is cached
			return this.#load(pedido, true); // go form tab directly
		const url = "/uae/pedidos/view?id=" + pedido.id; // resource
		api.init().json(url).then(data => this.#load(pedido, data.firmas));
	}

	firmar = () => { // final arrow function
		const url = "/uae/pedidos/firmar?id=" + pedido.getId();
		const fnThen = () => observer.emit("pedido-close", pedido.setProcesando());
		i18n.confirm("msgFirmar") && api.init().json(url).then(fnThen);
	}
	rechazar = () => { // accion de rechazo post reject
		const el = this.getElement("rechazo"); // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgRechazar")) return; // validation error or cancel by user
		const params = { id: pedido.getId(), rechazo: el.getValue() }; // url params
		const fnThen = () => observer.emit("pedido-close", pedido.setRechazada);
		api.init().json("/uae/pedidos/rechazar", params).then(fnThen);
	}
	cancelar = () => { // accion de cancelacion post reject
		const el = this.getElement("rechazo"); // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgCancelar")) return; // validation error or cancel by user
		const params = { id: pedido.getId(), rechazo: el.getValue() }; // url params
		const fnThen = () => observer.emit("pedido-close", pedido.setCancelada());
		api.init().json("/uae/pedidos/cancelar", params).then(fnThen);
	}
}

customElements.define("ref-input", Referencia, { extends: "input" });
customElements.define("proveedor-input", Proveedor, { extends: "input" });
customElements.define("categoria-pedido", Categoria, { extends: "select" });
customElements.define("aplicacion-input", Aplicacion, { extends: "input" });
customElements.define("firmas-block", Firmas, { extends: "div" });
