
import i18n from "../../i18n/langs.js";
import Base from "./Base.js";
import firma from "./Firma.js";

const CSS_ESTADOS = [
    //"-", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
    "text-warn", "text-green", "text-error", "text-green", "text-green", "text-warn", "text-warn", "text-error", "text-error", "text-error", "text-error"
];

const base = new Base(); // model instance
const PROCESANDO = 16; // Procesando tarea
const SUBSANABLE = 15; // Estado de subsanable
let _nif, _grupo, _admin; // User params

base.getNif = () => _nif;
base.setNif = val => { base._nif = val; return base; } 
base.isAdmin = () => _admin;
base.setAdmin = val => { _admin = val; return base; }
base.getGrupo = () => _grupo;
base.setGrupo = val => { _grupo = val; return base; }
base.setUser = ({ nif, grupo, admin }) => base.setNif(nif).setGrupo(grupo).setAdmin("1" == admin);
base.isUsuEc = () => !!_grupo;
base.isUxxiec = base.isUsuEc;
base.getUrl = path => "/uae" + path;

base.isDisabled = () => !base.isEditable();
base.isEditable = () => (!base.getId() || (base.getEstado() == 6));
base.isPendiente = () => (base.getEstado() == 5); // Pendiente de las firmas
base.isAceptada = () => (base.getEstado() == 1); // Aceptada por todos los firmantes
base.isRechazada = () => (base.getEstado() == 2); // Rechazada no llega a estado finalizada
base.isEjecutada = () => (base.getEstado() == 3); // Documentos creados en uxxiec y asociados a la solicitud
base.isIntegrada = () => (base.getEstado() == 4); // Solicitud integrada en uxxiec y notificada a los firmantes
base.isCancelada = () => (base.getEstado() == 7); // Solicitud cancelada por la UAE
base.isCaducada = () => (base.getEstado() == 8); // Solicitud caducada por expiración
base.isErronea = () => ((base.getEstado() == 9) || (base.getEstado() == 10)); // estado de error
base.isReactivable = () => (base.isUae() && base.isErronea()); // La solicitud se puede reactivar / subsanar
base.isProcesable = () => (base.getEstado() != PROCESANDO); // Solicitud en estado procesable
base.isProcesando = () => (base.getEstado() == PROCESANDO); // Solicitud procesando tarea
base.setProcesando = () => base.setEstado(PROCESANDO); // solicitud ejecutando tarea
base.isSubsanable = () => (base.getEstado() == SUBSANABLE); // Solicitud subsanable en el cliente
base.setSubsanable = () => base.setEstado(SUBSANABLE); // marca la solicitud como subsanable
base.isFinalizada = () => [1, 3, 4, 9, 10].includes(base.getEstado()); // Aceptada, Ejecutada, Notificada ó Erronea
base.isFirmada = () => (base.isAceptada() || base.isEjecutada());
base.isValidada = () => (base.isFirmada() || base.isIntegrada());
base.isInvalidada = () => (base.isRechazada() || base.isCancelada());
base.isAnulada = () => (base.isInvalidada() || base.isCaducada());
base.isReadOnly = () => (base.isAnulada() || base.isIntegrada());
base.isRemovable = () => (base.getId() && ((base.getEstado() == 6) || base.isAdmin()));

base.isUae = () => (_grupo == "2"); // UAE
base.isOtri = () => ((_grupo == "8") || (_grupo == "286") || (_grupo == "134") || (_grupo == "284")); // OTRI / UITT / UCCT / Catedras
//base.isUtec = () => (_grupo == "6"); //grupo de la unidad tecnica
//base.isEid = () => (_grupo == "287"); //Escuela Internacional de doctorado
//base.isAcad = () => (_grupo == "290"); //SERVICIO DE GESTION ACADEMICA
//base.isBecas = () => (_grupo == "288"); //BECAS
//base.isGaca = () => ((_grupo == "54") || (_grupo == "288") || (_grupo == "290") || (_grupo == "287")); // GACA / BECAS / ACADEMICO / EID
//base.isEut = () => (_grupo == "253"); //European University Of Technology (EUT+)
//base.isEstudiantes = () => (_grupo == "9");
//base.isContratacion = () => (_grupo == "68");

base.isMultilinea = () => (base.getMask() & 1);
base.isFirmable = () => (base.isPendiente() && firma.isFirmable(base.get("fmask")));
base.isCancelable = () => (base.isUae() && (base.isValidada() || base.isErronea()));
base.isInvalidable = () => (base.isFirmable() || base.isCancelable()); // show reject form 
base.isEditableUae = () => (base.isEditable() || base.isSubsanable() || (base.isUae() && base.isFirmable()));
base.isEjecutable = () => (base.isUae() && [1, 3, 4, 5, 9, 10].includes(base.getEstado())); // Pendiente, Aceptada, Ejecutada, Notificada ó Erronea
base.isNotificable = () => [1, 3, 9, 10].includes(base.getEstado()); // Aceptada, Ejecutada ó Erronea
base.isIntegrable = () => (base.isUae() && base.isNotificable()); // Requiere uae + estado notificable
base.isDocumentable = () => (base.isPendiente() || base.isValidada() || base.isErronea()); // muestra el boton de informe pdf
base.isUrgente = () => (base.get("fMax") && base.get("extra")); //solicitud urgente?
//base.setUrgente = ({ fMax, extra }) => { _data.fMax = fMax; _data.extra = extra; return base; }

base.getCodigo = () => base.get("codigo");
base.getMemoria = () => base.get("memo");
base.getDescEstado = () => i18n.getItem("descEstados", base.getEstado());
base.getStyleByEstado = () => (CSS_ESTADOS[base.getEstado()] || "text-warn");

base.rowActions = data => {
	base.setData(data); // initialize 
	let acciones = '<a href="#rcView" class="row-action"><i class="fas fa-search action resize text-blue"></i></a>';
	if (base.isFirmable()) {
		acciones += '<a href="#firmar" class="row-action resize table-refresh" data-refresh="is-procesable"><i class="fas fa-check action resize text-green"></i></a>';
		acciones += '<a href="#tab-reject" class="row-action resize table-refresh" data-refresh="is-procesable"><i class="fas fa-times action resize text-red"></i></a>';
	}
	if (base.isEjecutable())
		acciones += '<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action resize text-green"></i></a>';
	if (base.isIntegrable())
		acciones += '<a href="#integrar" class="row-action table-refresh" data-refresh="is-procesable"><i class="far fa-save action resize text-blue"></i></a>';
	if (base.isAdmin())
		acciones += '<a href="#emails" class="row-action"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#remove" class="row-action"><i class="fal fa-trash-alt action resize text-red"></i></a>';
	return acciones;
}
base.tfoot = resume => `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`;

export default base;
