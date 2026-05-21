
import FormHTML from "../../components/forms/FormHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import i18n from "../i18n/langs.js";
import observer from "../../core/util/Observer.js";

import pedido from "../model/Pedido.js";
import aplicacion from "../model/Aplicacion.js";

export default class PedidoForm extends FormHTML {
	#setImportes() {
		this.setValue("impIva", pedido.getImpIva()).setValue("impTotal", pedido.getImpTotal())
			.setValue("prorrata", pedido.getProrrata()).setValue("impPpto", pedido.getImpPpto());
	}

	connectedCallback() { // initialize form
		pedido.setUser(this.dataset); // load user info
		tabs.setAction("create", this.create); // set handlers
		tabs.setAction("firmar", this.firmar).setAction("rechazar", this.rechazar).setAction("cancelar", this.cancelar);
		tabs.setAction("adjunto", () => api.init().blob("/uae/pedidos/adjunto?id=" + pedido.getAdjunto()));

		this.addChange("imp", ev => { pedido.setImporte(ev.target.getValue()); this.#setImportes(); });
		this.addChange("iva", ev => { pedido.setIva(+ev.target.value); this.#setImportes(); });
	}

	#load(data, firmas) {
		this.load(pedido.setData(data)).#setImportes();
		observer.emit("firmas-updated", firmas);
		tabs.showForm(); // show form tab
	}
	create = () => {
		aplicacion.clear(); // empty data
		this.#load({ imp: 0, iva: 21, prorrata: +this.dataset.prorrata });
	}
	view = row => {
		if (!row) // row required
			return this.create();
		if (this.isCached(row.id)) // check if data is cached
			return this.#load(row, true); // go form tab directly
		const url = `/uae/pedidos/view?id=${row.id}&a=${row.apli}`; // resource
		api.init().json(url).then(data => { // server response
			aplicacion.setData(data.apli); // load related aplication
			this.#load(row, data.firmas); // show firmas list
		});
	}

	#close = firmas => {
		if (this.isCached(pedido.getId()))
			observer.emit("firmas-updated", firmas);
		observer.emit("pedido-close", pedido);
	}
	firmar = () => { // final arrow function
		const url = "/uae/pedidos/firmar?id=" + pedido.getId();
		const fnThen = data => this.#close(data.firmas, pedido.setProcesando());
		i18n.confirm("msgFirmar") && api.init().json(url).then(fnThen);
	}
	rechazar = () => { // accion de rechazo post reject
		const el = this.getElement("rechazo"); // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgRechazar")) return; // validation error or cancel by user
		const params = { id: pedido.getId(), rechazo: el.getValue() }; // url params
		const fnThen = data => this.#close(data.firmas, pedido.setRechazada());
		api.init().json("/uae/pedidos/rechazar", params).then(fnThen);
	}
	cancelar = () => { // accion de cancelacion post reject
		const el = this.getElement("rechazo"); // textarea input
		if (!el.force("errRechazar") || !i18n.confirm("msgCancelar")) return; // validation error or cancel by user
		const params = { id: pedido.getId(), rechazo: el.getValue() }; // url params
		const fnThen = data => this.#close(data.firmas, pedido.setCancelada());
		api.init().json("/uae/pedidos/cancelar", params).then(fnThen);
	}
}
