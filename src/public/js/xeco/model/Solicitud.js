
import i18n from "../../i18n/langs.js";
import Base from "./Base.js";
import firma from "./Firma.js";

const PROCESANDO = 16; // Procesando tarea
const SUBSANABLE = 15; // Estado de subsanable
const TEXT_WARN = "text-warn";
const TEXT_ERROR = "text-error";
const CSS_ESTADOS = [
    //"-", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", "Error Capa SOA", "Error de CV"
    TEXT_WARN, "text-green", TEXT_ERROR, "text-green", "text-green", TEXT_WARN, TEXT_WARN, TEXT_ERROR, TEXT_ERROR, TEXT_ERROR, TEXT_ERROR
];

class Solicitud extends Base {
	#nif; #grupo; #admin; // User params

	getNif = () => this.#nif;
	setNif = val => { this.#nif = val; return this; } 
	isAdmin = () => this.#admin;
	setAdmin = val => { this.#admin = val; return this; }
	getGrupo = () => this.#grupo;
	setGrupo = val => { this.#grupo = val; return this; }
	setUser = ({ nif, grupo, admin }) => this.setNif(nif).setGrupo(grupo).setAdmin("1" == admin);
	isUxxiec = () => !!this.#grupo;
	getUrl = () => "/uae"; // endpoint base path

	isDisabled = () => !this.isEditable();
	isReadonly = () => !this.isEditable();
	isEditable = () => (!this.getId() || (this.getEstado() == 6));
	isPendiente = () => (this.getEstado() == 5); // Pendiente de las firmas
	isAceptada = () => (this.getEstado() == 1); // Aceptada por todos los firmantes
	isRechazada = () => (this.getEstado() == 2); // Rechazada no llega a estado finalizada
	//this.setRechazada = () => this.setEstado(2); // marca la solicitud como rechazada
	isEjecutada = () => (this.getEstado() == 3); // Documentos creados en uxxiec y asociados a la solicitud
	isIntegrada = () => (this.getEstado() == 4); // Solicitud integrada en uxxiec y notificada a los firmantes
	isCancelada = () => (this.getEstado() == 7); // Solicitud cancelada por la UAE
	//this.setCancelada = () => this.setEstado(7); // marca la solicitud como cancelada
	isCaducada = () => (this.getEstado() == 8); // Solicitud caducada por expiración
	isErronea = () => ((this.getEstado() == 9) || (this.getEstado() == 10)); // estado de error
	isReactivable = () => (this.isUae() && this.isErronea()); // La solicitud se puede reactivar / subsanar
	//this.isProcesable = () => (this.getEstado() != PROCESANDO); // Solicitud en estado procesable
	//this.isProcesando = () => (this.getEstado() == PROCESANDO); // Solicitud procesando tarea
	setProcesando = () => this.setEstado(PROCESANDO); // solicitud ejecutando tarea
	isSubsanable = () => (this.getEstado() == SUBSANABLE); // Solicitud subsanable en el cliente
	setSubsanable = () => this.setEstado(SUBSANABLE); // marca la solicitud como subsanable
	isFinalizada = () => [1, 3, 4, 9, 10].includes(this.getEstado()); // Aceptada, Ejecutada, Notificada ó Erronea
	isFirmada = () => (this.isAceptada() || this.isEjecutada());
	isValidada = () => (this.isFirmada() || this.isIntegrada());
	isInvalidada = () => (this.isRechazada() || this.isCancelada());
	isAnulada = () => (this.isInvalidada() || this.isCaducada());
	isRemovable = () => (this.getId() && ((this.getEstado() == 6) || this.isAdmin()));

	isUae = () => (this.#grupo == "2"); // UAE
	isOtri = () => ((this.#grupo == "8") || (this.#grupo == "286") || (this.#grupo == "134") || (this.#grupo == "284")); // OTRI / UITT / UCCT / Catedras
	//this.isGaca = () => ((this.#grupo == "54") || (this.#grupo == "288") || (this.#grupo == "290") || (this.#grupo == "287")); // GACA / BECAS / ACADEMICO / EID
	//this.isUtec = () => (this.#grupo == "6"); //grupo de la unidad tecnica
	//this.isEid = () => (this.#grupo == "287"); //Escuela Internacional de doctorado
	//this.isAcad = () => (this.#grupo == "290"); //SERVICIO DE GESTION ACADEMICA
	//this.isBecas = () => (this.#grupo == "288"); //BECAS
	//this.isEut = () => (this.#grupo == "253"); //European University Of Technology (EUT+)
	//this.isEstudiantes = () => (this.#grupo == "9");
	//this.isContratacion = () => (this.#grupo == "68");

	isMultilinea = () => (this.getMask() & 1);
	isFirmable = () => (this.isPendiente() && firma.isFirmable(this.get("fmask")));
	isCancelable = () => (this.isUae() && (this.isValidada() || this.isErronea()));
	isInvalidable = () => (this.isFirmable() || this.isCancelable()); // show reject form 
	isEditableUae = () => (this.isEditable() || this.isSubsanable() || (this.isUae() && this.isFirmable()));
	isEjecutable = () => (this.isUae() && [1, 3, 4, 5, 9, 10].includes(this.getEstado())); // Pendiente, Aceptada, Ejecutada, Notificada ó Erronea
	isNotificable = () => (this.isUae() && [1, 3, 4, 9, 10].includes(this.getEstado())); // uae + Aceptada, Ejecutada, integrada ó Erronea
	isIntegrable =() => (this.isUae() && [1, 3, 9, 10].includes(this.getEstado())); // uae + Aceptada, Ejecutada ó Erronea
	isDocumentable = () => (this.isPendiente() || this.isValidada() || this.isErronea()); // muestra el boton de informe pdf
	isUrgente = () => (this.get("fMax") && this.get("extra")); //solicitud urgente?
	//this.setUrgente = ({ fMax, extra }) => { _data.fMax = fMax; _data.extra = extra; return this; }

	getCodigo = () => this.get("codigo");
	getMemoria = () => this.get("memo");
	getDescEstado = () => i18n.getItem("descEstados", this.getEstado());
	getStyleByEstado = () => (CSS_ESTADOS[this.getEstado()] || TEXT_WARN);
	validate = () => { throw new Error("You have to implement the method validate!"); }

	row = data => { // super not defined in arrow functions
		let acciones = '<a href="#view"><i class="fas fa-search action resize text-blue"></i></a>';
		if (this.setData(data).isFirmable()) { // initialize and verify state
			acciones += '<a href="#firmar" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-check action resize text-green"></i></a>';
			acciones += '<a href="#reject" class="resize table-refresh" data-refresh="isFirmable"><i class="fas fa-times action resize text-red"></i></a>';
		}
		if (this.isEjecutable())
			acciones += '<a href="#uxxiec"><i class="fal fa-cog action resize text-green"></i></a>';
		if (this.isIntegrable())
			acciones += '<a href="#integrar" class="table-refresh" data-refresh="isIntegrable"><i class="far fa-save action resize text-blue"></i></a>';
		if (this.isAdmin())
			acciones += '<a href="#emails"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#remove"><i class="fal fa-trash-alt action resize text-red"></i></a>';
		return acciones;
	}
	tfoot = resume => `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`;
}

export default new Solicitud();
