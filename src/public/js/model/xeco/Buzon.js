
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";

function Buzon() {
	const self = this; //self instance
    var _data, _isFacturaOtros, _tipoPago, _justPagoRequired;

    this.getData = () => _data;
    this.setData = data => { _data = data; return self; }

    this.isFacturaOtros = () => _isFacturaOtros;
    this.setFacturaOtros = val => { _isFacturaOtros = val; return self; }
    this.isIsu = () => sb.starts(_data.oCod, "300518") && ((_data.omask & 8) == 8);
    this.setTipoPago = tipo => { _tipoPago = tipo; return self; }
    this.isPagoProveedor = () => (_tipoPago == 1);
    this.isPagoCesionario = () => (_tipoPago == 2);
    this.isPagoUpct = () => (_tipoPago == 3);
    this.setJustPagoRequired = required => { _justPagoRequired = required; return self; }
    this.isJustPagoRequired = () => _justPagoRequired;

    this.isMonogrupo = () => !(_data.mask & 4);
    this.isMultigrupo = () => (_data.mask & 4);
    this.isResponsable = () => (_data.rol == 1);
    this.isUxxiec = () => (_data.rol == 2);
    this.isComprador = () => (_data.rol == 3);
    this.isHabilidato = () => (_data.rol == 4);
    this.isMisOrganicas = () => (_data.rol == 5);
    this.getRol = () => [ "Responsable", "UXXIEC", "Comprador", "Habilidato", "Habilidato en Mis Orgánicas" ][_data.rol - 1];
    this.isRemovable = () => (self.isHabilidato() && (_data.acc & 1));
    this.isFacturable = () => (_data.acc & 2);
	this.toggleFactura = () => { _data.acc = _data.acc^2; return self; }
    this.isReportProv = () => (_data.acc & 4);
	this.toggleReportProv = () => { _data.acc = _data.acc^4; return self; }
    this.isIngresos = () => (_data.acc & 8);
	this.toggleIngresos = () => { _data.acc = _data.acc^8; return self; }
    this.isGastos = () => (_data.acc & 16);
	this.toggleGastos = () => { _data.acc = _data.acc^16; return self; }
    this.isPermisoUser = () => (_data.acc & 32);
	this.togglePermisoUser = () => { _data.acc = _data.acc^32; return self; }

    this.lastRow = () => {
        return `<tr class="tb-data">
            <td id="otras" colspan="4"><b>Tramitación específica</b> (imputación a varias orgánicas, abonos, aportación de documentación adicional y otras circunstancias)</td>
            <td class="text-right">
                <a href="#buzon-otros" class="action resize text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>
            </td>
        </tr>`;
    }
	this.row = data => {
        const report = self.setData(data).isMultigrupo() ? "#modal" : "#report"; // organica multigrupo / monogrupo
        const anclar = '<a href="#anclar" class="action resize text-red row-action" title="Marca la orgánica como favorita"><i class="fas fa-thumbtack action resize text-blue"></i></a>';
        const desanclar = '<a href="#desanclar" class="action resize text-red row-action" title="Marca la orgánica como normal"><i class="fas fa-thumbtack action resize text-green"></i></a>';
        const ingresos = self.isIngresos() ? '<a href="#buzon" class="action resize text-green row-action" title="Avance de Ingresos"><i class="fas fa-italic"></i></a>' : "";
        const gastos = self.isGastos() ? '<a href="#buzon" class="action resize text-warn row-action" title="Avance de Gastos"><i class="fab fa-google"></i></a>' : "";
        const reportProv = self.isReportProv() ? `<a href="${report}" class="action resize text-blue row-action" title="Informe al Proveedor"><i class="fal fa-file-pdf"></i></a>` : "";
        const factura = self.isFacturable() ? '<a href="#buzon" class="action resize text-green row-action" title="Bandeja de facturas"><i class="far fa-file-upload"></i></a>' : "";
        const user = /*self.isPermisoUser()*/(1==1) ? '<a href="#users" class="action resize text-purple row-action" title="Gestión de permisos"><i class="fas fa-user"></i></a>' : ""; //TODO: change class for complete link
        return `<tr class="tb-data">
            <td>${data.oCod}</td><td class="hide-sm">${data.oDesc}</td>
            <td class="text-right">${i18n.isoFloat(data.cd ?? 0)} €</td>
            <td class="text-center">${self.getRol()}</td>
            <td class="text-right">${(data.mask & 2) ? desanclar : anclar}${user}${gastos}${ingresos}${reportProv}${factura}</td>
        </tr>`;
    }
    this.tfoot = resume => `<tr><td colspan="99">Filas: ${resume.size}</td></tr>`;

    this.rowUsuarios = data => {
        self.setData(data);
        const classPermisoUser = self.isPermisoUser() ? "action resize text-purple row-action" : "action resize text-purple row-action text-disabled";
        const classGastos = self.isGastos() ? "action resize text-warn row-action" : "action resize text-warn row-action text-disabled";
        const classIngresos = self.isIngresos() ? "action resize text-green row-action" : "action resize text-green row-action text-disabled";
        const classReportProv = self.isReportProv() ? "action resize text-blue row-action" : "action resize text-blue row-action text-disabled";
        const classFactura = self.isFacturable() ? "action resize text-green row-action" : "action resize text-green row-action text-disabled";
        const remove = self.isRemovable() ? '<a href="#remove" class="action resize text-red row-action" title="Desvincular orgánica"><i class="fas fa-times"></i></a>' : "";
        return `<tr class="tb-data">
            <td class="text-center">${data.nif}</td><td>${data.nombre}</td><td>${self.getRol()}</td>
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
    this.tfootUsuarios = resume => `<tr><td colspan="99">Usuarios: ${resume.size}</td></tr>`;

    this.isValidOrganica = function(data) {
        const valid = i18n.getValidators();
        valid.isKey("organica", data.idOrg, "No ha seleccionado correctamente la orgánica"); // autocomplete required number
        valid.isKey("tramit", data.tramit, "Unidad tramitadora no encontrada"); // select required number
        return valid.close("Orgánica / Unidad Tramitadora no seleccionada correctamente.");
    }
    this.validate = function(data) {
    	return self.isValidOrganica(data);
    	// extra validations......
    }
}

export default new Buzon();
