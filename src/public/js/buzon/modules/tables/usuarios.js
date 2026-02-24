
import Table from "../../../components/Table.js";
import api from "../../../components/Api.js";
import buzon from "../../model/Buzon.js";
import form from "../buzon.js";

export default class Usuarios extends Table {
	constructor(form) {
		super(form.getNextElement());
	}

	init() {
		const fnToggle = data => {
			const params = { org: data.org, nif: data.nif, acc: data.acc };
			api.init().json("/uae/buzon/user/toggle", params).then(this.reload);
		}

		this.set("#toggleUsers", data => { buzon.setData(data).togglePermisoUser(); fnToggle(data); });
		this.set("#toggleGastos", data => { buzon.setData(data).toggleGastos(); fnToggle(data); });
		this.set("#toggleIngresos", data => { buzon.setData(data).toggleIngresos(); fnToggle(data); });
		this.set("#toggleReportProv", data => { buzon.setData(data).toggleReportProv(); fnToggle(data); });
		this.set("#toggleFactura", data => { buzon.setData(data).toggleFactura(); fnToggle(data); });
		this.setRemove(data => {
			buzon.setData(data);
			const params = { org: data.oCod, nif: data.nif };
			return api.init().text("/uae/buzon/user/remove", params).then(form.setOk);
		});
	}

	row(data) {
		buzon.setData(data);
		const classPermisoUser = buzon.isPermisoUser() ? "action resize text-purple" : "action resize text-purple text-disabled";
		const classGastos = buzon.isGastos() ? "action resize text-warn" : "action resize text-warn text-disabled";
		const classIngresos = buzon.isIngresos() ? "action resize text-green" : "action resize text-green text-disabled";
		const classReportProv = buzon.isReportProv() ? "action resize text-blue" : "action resize text-blue text-disabled";
		const classFactura = buzon.isFacturable() ? "action resize text-green" : "action resize text-green text-disabled";
		const remove = buzon.isRemovable() ? '<a href="#remove" class="action resize text-red" title="Desvincular orgánica"><i class="fas fa-times"></i></a>' : "";

		return `<tr class="tb-data">
			<td class="text-center">${data.nif}</td><td>${data.nombre}</td><td>${buzon.getRol()}</td>
			<td class="currency">
				<a href="#toggleUsers" class="${classPermisoUser}" title="Gestión de permisos"><i class="fas fa-user"></i></a>
				<a href="#toggleGastos" class="${classGastos}" title="Avance de Gastos"><i class="fab fa-google"></i></a>
				<a href="#toggleIngresos" class="${classIngresos}" title="Avance de Ingresos"><i class="fas fa-info"></i></a>
				<a href="#toggleReportProv" class="${classReportProv}" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>
				<a href="#toggleFactura" class="${classFactura}" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
				${remove}
			</td>
		</tr>`;
	}
}
