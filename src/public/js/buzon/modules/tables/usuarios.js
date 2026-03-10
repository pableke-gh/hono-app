
import TableHTML from "../../../components/TableHTML.js";
import api from "../../../components/Api.js";
import buzon from "../../model/Buzon.js";

export default class Usuarios extends TableHTML {
	connectedCallback() {
		const form = document.forms["usuarios"];
		const fnToggle = data => {
			const params = { org: data.org, nif: data.nif, acc: data.acc };
			api.init().json("/uae/buzon/user/toggle", params).then(() => this.refreshRow());
		}

		this.set("#toggleUsers", data => { buzon.setData(data).togglePermisoUser(); fnToggle(data); });
		this.set("#toggleGastos", data => { buzon.setData(data).toggleGastos(); fnToggle(data); });
		this.set("#toggleIngresos", data => { buzon.setData(data).toggleIngresos(); fnToggle(data); });
		this.set("#toggleReportProv", data => { buzon.setData(data).toggleReportProv(); fnToggle(data); });
		this.set("#toggleFactura", data => { buzon.setData(data).toggleFactura(); fnToggle(data); });
		this.setRemove(data => {
			const params = { org: data.oCod, nif: data.nif };
			return api.init().text("/uae/buzon/user/remove", params).then(form.setOk);
		});

		this.set("update-icons", (el, data) => {
			buzon.setData(data); // load current data row
			el.children[0].classList.toggle("text-disabled", !buzon.isPermisoUser());
			el.children[1].classList.toggle("text-disabled", !buzon.isGastos());
			el.children[2].classList.toggle("text-disabled", !buzon.isIngresos());
			el.children[3].classList.toggle("text-disabled", !buzon.isReportProv());
			el.children[4].classList.toggle("text-disabled", !buzon.isFacturable());
		});
	}

	row(data, resume) {
		const tpl = '<a href="#remove" class="action resize text-red" title="Desvincular orgánica"><i class="fas fa-times"></i></a>';
		const remove = buzon.setData(data).isRemovable() ? tpl : "";
		return `<tr class="tb-data">
			<td class="text-center">${resume.count}</td>
			<td class="text-center">${data.nif}</td><td>${data.nombre}</td><td>${buzon.getRol()}</td>
			<td class="currency table-refresh" data-refresh="update-icons">
				<a href="#toggleUsers" class="action resize text-purple" title="Gestión de permisos"><i class="fas fa-user"></i></a>
				<a href="#toggleGastos" class="action resize text-warn" title="Avance de Gastos"><i class="fab fa-google"></i></a>
				<a href="#toggleIngresos" class="action resize text-green" title="Avance de Ingresos"><i class="fas fa-info"></i></a>
				<a href="#toggleReportProv" class="action resize text-blue" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>
				<a href="#toggleFactura" class="action resize text-green" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
				${remove}
			</td>
		</tr>`;
	}

	afterRender() {
		this.refreshBody();
	}
}
