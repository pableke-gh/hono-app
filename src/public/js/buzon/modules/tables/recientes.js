
import i18n from "../../i18n/langs.js";
import buzon from "../../model/Buzon.js";
import Organicas from "./organicas.js";
import Observer from "../../util/Observer.js";
import form from "../buzon.js";

export default class Recientes extends Organicas {
	constructor(form) {
		super(form.querySelector("#recientes"));
		this.setRowEmpty(this.lastRow());
	}

	init() {
		super.init();
		form.onChangeInput("#pagina", ev => this.paginate(+ev.target.value));

		const fnRender = () => this.render();
		Observer.subscribe("anclar", fnRender).subscribe("desanclar", fnRender);
		// update colspan on small scereens
		//const isMediaXs = () => (window.innerWidth < 576);
		//const fnResize = () => this.getLastRow().cells[0].setAttribute("colspan", isMediaXs() ? 3 : 4);
		//window.addEventListener("resize", fnResize);
		//fnResize(); // init colspan on load
	}

	paginate(size) {
		this.getRows().forEach((row, i) => row.setVisible(i < size));
		this.getLastRow().show();
		return this;
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
	lastRow = () => `<tr class="tb-data">
		<td id="otras" colspan="4"><b>Tramitación específica</b> (imputación a varias orgánicas, abonos, aportación de documentación adicional y otras circunstancias)</td>
		<td class="currency">
			<a href="#buzon-otros" class="action resize text-green" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
		</td>
	</tr>`;

	render() { return super.render(super.getRecientes()); }
}
