
import buzon from "./Buzon.js";

function Usuario() {
	const self = this; //self instance

	this.row = data => {
        buzon.setData(data);
        const classPermisoUser = buzon.isPermisoUser() ? "action resize text-purple" : "action resize text-purple text-disabled";
        const classGastos = buzon.isGastos() ? "action resize text-warn" : "action resize text-warn text-disabled";
        const classIngresos = buzon.isIngresos() ? "action resize text-green" : "action resize text-green text-disabled";
        const classReportProv = buzon.isReportProv() ? "action resize text-blue" : "action resize text-blue text-disabled";
        const classFactura = buzon.isFacturable() ? "action resize text-green" : "action resize text-green text-disabled";
        const remove = buzon.isRemovable() ? '<a href="#remove" class="action resize text-red" title="Desvincular orgánica"><i class="fas fa-times"></i></a>' : "";
        return `<tr class="tb-data">
            <td class="text-center">${data.nif}</td><td>${data.nombre}</td><td>${buzon.getRol()}</td>
            <td class="text-right">
                <a href="#toggleUsers" class="${classPermisoUser}" title="Gestión de permisos"><i class="fas fa-user"></i></a>
                <a href="#toggleGastos" class="${classGastos}" title="Avance de Gastos"><i class="fab fa-google"></i></a>
                <a href="#toggleIngresos" class="${classIngresos}" title="Avance de Ingresos"><i class="fas fa-info"></i></a>
                <a href="#toggleReportProv" class="${classReportProv}" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>
                <a href="#toggleFactura" class="${classFactura}" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
                ${remove}
            </td>
        </tr>`;
    }
    this.tfoot = resume => `<tr><td colspan="99">Usuarios: ${resume.size}</td></tr>`;
	this.getTable = () => ({ onRender: self.row, onFooter: self.tfoot });
}

export default new Usuario();
