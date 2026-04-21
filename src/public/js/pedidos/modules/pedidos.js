
import TableHTML from "../../components/TableHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import i18n from "../i18n/langs.js";
import observer from "../../core/util/Observer.js";
import pedido from "../model/Pedido.js";

export default class PedidosTable extends TableHTML {
	showList = () => { this.refreshRow(); tabs.showList(); } // refresh current row + show list tab
	setWorking = () => { pedido.setProcesando(); this.showList(); } // update current row state

	connectedCallback() { // initialize table
		const form = document.forms["pedido-form"];
		observer.subscribe("pedido-close", this.showList);

		this.setMsgEmpty("No se han encontrado solicitudes para a la búsqueda seleccionada");
		this.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
			const url = "/uae/pedidos/ws?id=" + pedido.setData(data).getId();
			i18n.confirm("msgIntegrar") && api.init().json(url).then(this.setWorking);
		});

		this.set("view", form.view);
		this.set("firmar", data => { pedido.setData(data); form.firmar(); });
		this.set("reject", data => { // open reject tab for rechazar / cancelar
			form.refresh(pedido.setData(data)); // preload data
			observer.emit("firmas-updated", form.isCached(data.id)); // check if data is cached
			tabs.show("reject"); // show reject tab
		});

		this.set("isFirmable", (link, data) => pedido.setData(data).isFirmable())
		this.set("isIntegrable", (link, data) => pedido.setData(data).isIntegrable())
		this.set("update-estado", (td, data) => { // actualizo la celda del estado
			td.innerHTML = pedido.setData(data).getDescEstado(); // set texto de estado
			td.className = pedido.getStyleByEstado() + " hide-xs table-refresh"; // set estilos
		});
		tabs.setAction("remove", this.remove); // default remove
	}

	row(data) {
		return `<tr></tr>`;
	}

	flush() { // override super class
		const id = this.getId() || pedido.getId(); // row selected or current data if remove when creating
		const fnThen = () => { super.flush(); tabs.showList(); } // fire after success remove
		api.init().json("/uae/pedidos/remove?id=" + id).then(fnThen); // call service
	}
}
