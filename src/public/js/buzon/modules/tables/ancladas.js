
import coll from "../../../components/CollectionHTML.js";
import i18n from "../../i18n/langs.js";
import buzon from "../../model/Buzon.js";
import Organicas from "./organicas.js";
import Observer from "../../util/Observer.js";

export default class Ancladas extends Organicas {
	connectedCallback() {
		super.init();
		const fnRender = () => this.render();
		this.setOrganicas(coll.parse(this.previousElementSibling.innerHTML)); // load all organicas
		Observer.subscribe("anclar", fnRender).subscribe("desanclar", fnRender); // add listeners
		this.render(); // muestro las organicas ancladas
	}

	row(data) {
		const report = buzon.setData(data).isMultigrupo() ? "#modal" : "#report"; // organica multigrupo / monogrupo
		const anclar = '<a href="#anclar" class="action resize text-red" title="Marca la orgánica como favorita"><i class="fas fa-thumbtack action resize text-blue"></i></a>';
		const desanclar = '<a href="#desanclar" class="action resize text-red" title="Marca la orgánica como normal"><i class="fas fa-thumbtack action resize text-green"></i></a>';
		const ingresos = buzon.isIngresos() ? '<a href="#buzon" class="action resize text-green" title="Avance de Ingresos"><i class="fas fa-italic"></i></a>' : "";
		const gastos = buzon.isGastos() ? '<a href="#buzon" class="action resize text-warn" title="Avance de Gastos"><i class="fab fa-google"></i></a>' : "";
		const reportProv = buzon.isReportProv() ? `<a href="${report}" class="action resize text-blue" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>` : "";
		const factura = buzon.isFacturable() ? '<a href="#buzon" class="action resize text-green" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>' : "";
		const user = /*buzon.isPermisoUser()*/(1==1) ? '<a href="#users" class="action resize text-purple" title="Gestión de permisos"><i class="fas fa-user"></i></a>' : ""; //TODO: change class for complete link
		return `<tr class="tb-data">
			<td>${data.oCod}</td><td class="hide-xs">${data.oDesc}</td>
			<td class="currency">${i18n.isoFloat(data.cd ?? 0)} €</td>
			<td class="text-center">${buzon.getRol()}</td>
			<td class="currency">${(data.mask & 2) ? desanclar : anclar}${user}${gastos}${ingresos}${reportProv}${factura}</td>
		</tr>`;
	}

	render() { return super.render(super.getAncladas()); }
	afterRender() { this.parentNode.setVisible(this.size() > 0); }
}
