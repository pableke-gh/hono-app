
import TableHTML from "../../components/TableHTML.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";

import i18n from "../i18n/langs.js";
import firma from "../../core/model/Firma.js";
import observer from "../../core/util/Observer.js";
import pedido from "../model/Pedido.js";

export default class PedidosTable extends TableHTML {
	showList = () => { this.refreshRow(); tabs.showList(); } // refresh current row + show list tab
	setWorking = () => { pedido.setProcesando(); this.showList(); } // update current row state

	connectedCallback() { // initialize table
		const form = document.forms["pedido-form"];
		observer.subscribe("pedido-close", this.showList);

		// table actions
		this.setMsgEmpty("No se han encontrado solicitudes para a la búsqueda seleccionada");
		this.set("#emails", data => api.init().json("/uae/pedidos/emails?id=" + data.id)); // admin test email
		this.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
			const url = "/uae/pedidos/ws?id=" + pedido.setData(data).getId();
			i18n.confirm("msgIntegrar") && api.init().json(url).then(this.setWorking);
		});

		this.set("#view", data => form.view(data)).set("#report", this.report);
		this.set("#firmar", data => { pedido.setData(data); form.firmar(); });
		this.set("#reject", data => { // open reject tab for rechazar / cancelar
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

		// buttons action
		tabs.setAction("view", () => form.view(this.getCurrent()))
			.setAction("report", this.report).setAction("remove", this.remove);
	}

	row(data) {
		let acciones = '<a href="#view"><i class="fas fa-search action resize text-blue"></i></a>';
		if (pedido.setData(data).isFirmable()) { // initialize and verify state
			acciones += '<a href="#firmar" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-check action resize text-green"></i></a>';
			acciones += '<a href="#reject" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-times action resize text-red"></i></a>';
		}
		if (pedido.isDocumentable())
			acciones += '<a href="#report" title="Informe SPI"><i class="fal fa-file-pdf action resize text-red"></i></a>';
		if (pedido.isIntegrable())
			acciones += '<a href="#integrar" class="table-refresh" data-refresh="isIntegrable"><i class="far fa-save action resize text-blue"></i></a>';
		if (pedido.isAdmin())
			acciones += '<a href="#emails"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#remove"><i class="fal fa-trash-alt action resize text-red"></i></a>';

		return `<tr class="tb-data">
			<td class="text-center"><a href="#view">${data.codigo}</a></td>
			<td class="${pedido.getStyleByEstado()} hide-xs table-refresh" data-refresh="update-estado">${pedido.getDescEstado()}</td>
			<td class="text-center hide-xs">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td class="text-center">${pedido.isValidada() ? data.exp : ""}</td><td>${data.nif}</td>
			<td class="hide-xs">${data.prov}</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fecha)}</td>
			<td class="currency">${i18n.isoFloat(pedido.getImpPpto())} €</td>
			<td class="hide-sm">${data.sol}</td>
			<td class="hide-md">${data.desc}</td>
			<td class="currency no-print">${acciones}</td>
		</tr>`;
	}

	report = () => { // final arrow function to call report service
		api.init().text("/uae/pedidos/report?id=" + this.getId()).then(api.open);
	}

	flush() { // override super class
		const id = this.getId() || pedido.getId(); // row selected or current data if remove when creating
		const fnThen = () => { super.flush(); tabs.showList(); } // fire after success remove
		api.init().json("/uae/pedidos/remove?id=" + id).then(fnThen); // call service
	}
}
