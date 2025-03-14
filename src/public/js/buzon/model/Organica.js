
import i18n from "../../i18n/langs.js";
import buzon from "./Buzon.js";

function Organica() {
	const self = this; //self instance

	this.row = data => {
        const report = buzon.setData(data).isMultigrupo() ? "#modal" : "#report"; // organica multigrupo / monogrupo
        const anclar = '<a href="#anclar" class="action resize text-red row-action" title="Marca la orgánica como favorita"><i class="fas fa-thumbtack action resize text-blue"></i></a>';
        const desanclar = '<a href="#desanclar" class="action resize text-red row-action" title="Marca la orgánica como normal"><i class="fas fa-thumbtack action resize text-green"></i></a>';
        const ingresos = buzon.isIngresos() ? '<a href="#buzon" class="action resize text-green row-action" title="Avance de Ingresos"><i class="fas fa-italic"></i></a>' : "";
        const gastos = buzon.isGastos() ? '<a href="#buzon" class="action resize text-warn row-action" title="Avance de Gastos"><i class="fab fa-google"></i></a>' : "";
        const reportProv = buzon.isReportProv() ? `<a href="${report}" class="action resize text-blue row-action" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>` : "";
        const factura = buzon.isFacturable() ? '<a href="#buzon" class="action resize text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>' : "";
        const user = /*buzon.isPermisoUser()*/(1==1) ? '<a href="#usersByOrganica" class="action resize text-purple row-action" title="Gestión de permisos"><i class="fas fa-user"></i></a>' : ""; //TODO: change class for complete link
        return `<tr class="tb-data">
            <td>${data.oCod}</td><td class="hide-xs">${data.oDesc}</td>
            <td class="text-right">${i18n.isoFloat(data.cd ?? 0)} €</td>
            <td class="text-center">${buzon.getRol()}</td>
            <td class="text-right">${(data.mask & 2) ? desanclar : anclar}${user}${gastos}${ingresos}${reportProv}${factura}</td>
        </tr>`;
    }
    this.lastRow = () => {
        return `<tr class="tb-data">
            <td id="otras" colspan="4"><b>Tramitación específica</b> (imputación a varias orgánicas, abonos, aportación de documentación adicional y otras circunstancias)</td>
            <td class="text-right">
                <a href="#buzon-otros" class="action resize text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
            </td>
        </tr>`;
    }
    this.tfoot = resume => `<tr><td colspan="99">Filas: ${resume.size}</td></tr>`;
	this.getTableAncladas = () => ({ onRender: self.row, onFooter: self.tfoot });
	this.getTableRecientes = () => ({ rowEmptyTable: self.lastRow(), onRender: self.row, onLastRow: self.lastRow, onFooter: self.tfoot });

    this.validate = data => {
        const valid = i18n.getValidators();
        valid.isKey("organica", data.idOrg, "No ha seleccionado correctamente la orgánica"); // autocomplete required number
        valid.isKey("tramit", data.tramit, "Unidad tramitadora no encontrada"); // select required number
        return valid.close("Orgánica / Unidad Tramitadora no seleccionada correctamente.");
    }
}

export default new Organica();
