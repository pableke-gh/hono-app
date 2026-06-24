
import TableHTML from "../../core/components/Table.js";
import i18n from "../i18n/langs.js";
import pedido from "../model/Pedido.js";

export default class ControlesTable extends TableHTML {
	connectedCallback() { // table initialization
		const form = document.forms["pedido-form"];
		this.setMsgEmpty("No existen pedidos que incumplan el control seleccionado");
		this.set("#view", form.load);
	}

	row(data) {
		pedido.setData(data);
		const view = '<a href="#view"><i class="fas fa-search action resize text-blue"></i></a>';
		return `<tr class="tb-data">
			<td class="text-center"><a href="#view">${data.codigo}</a></td>
			<td class="${pedido.getStyleByEstado()} hide-xs">${pedido.getDescEstado()}</td>
			<td class="text-center">${data.exp || ""}</td><td>${data.nif}</td>
			<td class="hide-xs">${data.prov}</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fecha)}</td>
			<td class="currency">${i18n.isoFloat(pedido.getImpPpto())} €</td>
			<td class="hide-sm">${data.sol}</td>
			<td class="hide-md">${data.desc}</td>
			<td class="currency no-print">${view}</td>
		</tr>`;
	}
}
