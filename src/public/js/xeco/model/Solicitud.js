
import i18n from "../../i18n/langs.js";
import firma from "./Firma.js";

const CSS_ESTADOS = [
    //"-", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
    "text-warn", "text-green", "text-error", "text-green", "text-green", "text-warn", "text-warn", "text-error", "text-error", "text-error", "text-error"
];

function Solicitud() {
	const self = this; //self instance
	let _data, _nif, _grupo, _admin;

	this.getData = () => _data;
	this.get  = name => _data[name];
	this.setData = data => { _data = data; return self; }
	this.set = (name, value) => { _data[name] = value; return self; }
	this.update = data => self;

	this.getNif = () => _nif;
	this.setNif = val => { self._nif = val; return self; } 
	this.isAdmin = () => _admin;
	this.setAdmin = val => { _admin = val; return self; }

	this.setGrupo = val => { _grupo = val; return self; }
	this.setUser = ({ nif, grupo, admin }) => self.setNif(nif).setGrupo(grupo).setAdmin("1" == admin);
	this.isUsuEc = () => !!_grupo;
	this.isUxxiec = self.isUsuEc;

	this.getTipo = () => _data.tipo;
	this.getSubtipo = () => _data.subtipo;
	this.setSubtipo = value => { _data.subtipo = value; return self; }
	this.getEstado = () => _data.estado;
	this.getMask = () => _data.mask;

	this.isDisabled = () => !self.isEditable();
	this.isEditable = () => (!_data.id || (_data.estado == 6));
	this.isPendiente = () => (_data.estado == 5); // Pendiente de las firmas
	this.isAceptada = () => (_data.estado == 1); // Aceptada por todos los firmantes
	this.isRechazada = () => (_data.estado == 2); // Rechazada no llega a estado finalizada
	this.isEjecutada = () => (_data.estado == 3); // Documentos creados en uxxiec y asociados a la solicitud
	this.isIntegrada = () => (_data.estado == 4); // Solicitud integrada en uxxiec y notificada a los firmantes
	this.isCancelada = () => (_data.estado == 7); // Solicitud cancelada por la UAE
	this.isCaducada = () => (_data.estado == 8); // Solicitud caducada por expiración
	this.isErronea = () => ((_data.estado == 9) || (_data.estado == 10)); // estado de error
	this.isFinalizada = () => [1, 3, 4, 9, 10].includes(_data.estado); // Aceptada, Ejecutada, Notificada ó Erronea
	this.isFirmada = () => (self.isAceptada() || self.isEjecutada());
	this.isValidada = () => (self.isFirmada() || self.isIntegrada());
	this.isInvalidada = () => (self.isRechazada() || self.isCancelada());
	this.isAnulada = () => (self.isInvalidada() || self.isCaducada());
	this.isReadOnly = () => (self.isAnulada() || self.isIntegrada());
	this.isRemovable = () => ((_data.estado == 6) || self.isAdmin());

	this.isUae = () => (_grupo == "2"); // UAE
	this.isOtri = () => ((_grupo == "8") || (_grupo == "286") || (_grupo == "134") || (_grupo == "284")); // OTRI / UITT / UCCT / Catedras
	//this.isUtec = () => (_grupo == "6");
	//this.isGaca = () => (_grupo == "54");
	//this.isEut = () => (_grupo == "253");
	//this.isEstudiantes = () => (_grupo == "9");
	//this.isContratacion = () => (_grupo == "68");

	this.isFirmable = () => (self.isPendiente() && firma.isFirmable(_data.fmask));
	this.isCancelable = () => (self.isUae() && self.isValidada());
	this.isRechazable = () => (_data.id && (self.isFirmable() || self.isCancelable()));
	this.isEditableUae = () => (self.isEditable() || (self.isUae() && self.isFirmable()));
	this.isEjecutable = () => (self.isUae() && [1, 3, 4, 5, 9, 10].includes(_data.estado)); // Pendiente, Aceptada, Ejecutada, Notificada ó Erronea
	this.isNotificable = () => [1, 3, 9, 10].includes(_data.estado); // Aceptada, Ejecutada ó Erronea
	this.isIntegrable = () => (self.isUae() && self.isNotificable()); // Requiere uae + estado notificable
	this.isUrgente = () => (_data.fMax && _data.extra); //solicitud urgente?
	//this.setUrgente = ({ fMax, extra }) => { _data.fMax = fMax; _data.extra = extra; return self; }

	this.getCodigo = () => _data.codigo;
	this.getMemoria = () => _data.memo;
	this.getDescEstado = () => i18n.getItem("descEstados", _data.estado);
	this.getStyleByEstado = () => (CSS_ESTADOS[_data.estado] || "text-warn");
	this.validate = globalThis.void; // abstract validator => redefine in child classes

	this.rowActions = data => {
		self.setData(data); // initialize 
		let acciones = '<a href="#rcView" class="row-action"><i class="fas fa-search action resize text-blue"></i></a>';
		if (self.isFirmable())
			acciones += `<a href="#rcFirmar" class="row-action resize once-action" data-confirm="msgFirmar"><i class="fas fa-check action resize text-green"></i></a>
						<a href="#tab-reject" class="row-action resize once-action"><i class="fas fa-times action resize text-red"></i></a>`;
		if (self.isEjecutable())
			acciones += '<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action resize text-green"></i></a>';
		if (self.isIntegrable())
			acciones += '<a href="#rcIntegrar" class="row-action once-action" data-confirm="msgIntegrar"><i class="far fa-save action resize text-blue"></i></a>';
		if (self.isAdmin())
			acciones += '<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action resize text-red"></i></a>';
		return acciones;
	}
}

export default new Solicitud();
