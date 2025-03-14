
import sb from "../../components/types/StringBox.js";

function Buzon() {
	const self = this; //self instance
    var _data, _isFacturaOtros, _tipoPago, _justPagoRequired;

    this.getData = () => _data;
    this.setData = data => { _data = data; return self; }

	this.getOrganica = () => _data.oCod;
	this.getUnidadTramit = () => _data.ut;
	this.getNif = () => _data.nif;

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
	this.isActiveTab4 = () => (self.isMultigrupo() || self.isFacturaOtros());

    this.validate = data => {
    	return true;// validations......
    }
}

export default new Buzon();
