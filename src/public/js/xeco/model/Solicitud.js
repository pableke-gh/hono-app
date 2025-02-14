
import i18n from "../../i18n/langs.js";

function Firma() {
	const self = this; //self instance

    this.isPrincipal = mask => (mask & 2);
    this.isAceptada = mask => (mask & 32);
	this.isRechazada = (mask, info) => (!self.isAceptada(mask) && info);
	this.isFirmable = mask => (mask & 64); //puesto a la firma?

    this.myFlag = (mask, info) => {
        if (self.isAceptada(mask))
            return '<i class="fas fa-flag fa-lg icon icon-green" title="Solicitud firmada"></i>';
        if (self.isRechazada(mask, info))
            return '<i class="fas fa-flag fa-lg icon icon-green" title="Solicitud firmada"></i>';
        return '<i class="fas fa-flag fa-lg icon icon-warn" title="Solicitud pendiente de firma"></i>'
    }
}

function Firmas() {
	const self = this; //self instance
    const firma = new Firma();

    let data; // array
    this.getData = () => data;
    this.setData = firmas => { data = firmas; return self; }

    this.getFirma = () => firma;
    this.getPrincipales = () => data.filter(f => firma.isFirmable(f.mask));
}

const CSS_ESTADOS = [
    //"-", "Aceptada", "Rechazada", "Ejecutada", "Integrada", "Pendiente", "Editable", "Cancelada", "Caducada", "Error Capa SOA", "Error de Crédito Vinculante"
    "text-warn", "text-green", "text-error", "text-green", "text-green", "text-warn", "text-warn", "text-error", "text-error", "text-error", "text-error"
];

export default class Solicitud {
    static #instance; // singleton
    #firmas = new Firmas();
    #data; #nif; #grupo;

    constructor() {
        Solicitud.#instance = this;
    }

    static get instance() { return Solicitud.#instance; } // property access
    static self() { return Solicitud.#instance; } // function getter access

    get data() { return this.#data; }
    getData() { return this.#data; }
    get(name) { return this.#data[name]; }
    //set data(value) { this.#data = value; } // set the property value
    setData(data) { this.#data = data; return this; }
    set(name, value) { this.#data[name] = value; return this; }

    getNif() { return this.#nif; }
    setNif(val) { this.#nif = val; return this; }
    isAdmin() { return ("23024374V" == this.#nif); }

    setGrupo(val) { this.#grupo = val; return this; }
    setUser(data) { return this.setNif(data.nif).setGrupo(data.grupo); }
    isUsuEc() { return !!this.#grupo; }
    isUxxiec = this.isUsuEc;

    get firmas() { return this.#firmas; }
    getFirmas() { return this.firmas; }
    getFirma = this.firmas.getFirma;

    get tipo() { return this.data.tipo; }
    getTipo() { return this.data.tipo; }
    getSubtipo() { return this.data.subtipo; }
    setSubtipo(value) { this.data.subtipo = value; return this; }
    getEstado() { return this.data.estado; }
    get mask() { return this.data.mask; }
    getMask() { return this.data.mask; }

    isPendiente() { return (this.data.estado == 5); }
    isAceptada() { return (this.data.estado == 1); } // Aceptada por todos los firmantes
    isRechazada() { return (this.data.estado == 2); } // Rechazada no llega a estado finalizada
    isIntegrada() { return (this.data.estado == 4); } // Solicitud integrada en uxxiec
    isCancelada() { return (this.data.estado == 7); } // Solicitud cancelada por la UAE
    isCaducada() { return (this.data.estado == 8); } // Solicitud caducada por expiración
    isErronea() { return ((this.data.estado == 9) || (this.data.estado == 10)); } // estado de error
    isFinalizada() { return [1, 3, 4, 9, 10].includes(this.data.estado); } // Aceptada, Ejecutada, Notificada ó Erronea
    isAnulada() { return (this.isRechazada() || this.isCancelada() || this.isCaducada()); }
    isReadOnly() { return (this.isAnulada() || this.isIntegrada()); }

    isUae() { return (this.#grupo == "2"); } // UAE
    isOtri() { return ((this.#grupo == "8") || (this.#grupo == "286") || (this.#grupo == "134") || (this.#grupo == "284")); } // OTRI / UITT / UCCT / Catedras
    //isUtec() { return (this.#grupo == "6"); }
    //isGaca() { return (this.#grupo == "54"); }
    //isEut() { return (this.#grupo == "253"); }
    //isEstudiantes() { return (this.#grupo == "9"); }
    //isContratacion() { return (this.#grupo == "68"); }

    isDisabled() { return this.data.id; }
    isEditable() { return !this.data.id; }
    isFirmable() { return (this.isPendiente() && this.getFirma().isFirmable(this.data.fmask)); }
    isRechazable() { return (this.data.id && (this.isUae() || this.isFirmable())); }
	isEditableUae() { return (this.isEditable() || (this.isUae() && this.isFirmable())); }
    isEjecutable() { return (this.isUae() && this.isFinalizada()); } // Requiere uae + estado finalizada
    isNotificable() { return [1, 3, 9, 10].includes(this.data.estado); } // Aceptada, Ejecutada ó Erronea
    isIntegrable() { return (this.isUae() && this.isNotificable()); } // Requiere uae + estado notificable
	isUrgente() { return (this.data.fMax && this.data.extra); } //solicitud urgente?

    getDescEstado() { return i18n.getItem("descEstados", this.data.estado); }
    getStyleByEstado() { return CSS_ESTADOS[this.data.estado] || "text-warn"; }

    // Language validators pre-initialized in CollectionHTML
    validate() { return i18n.getValidators(); }
    validateReject(data) {
        const valid = i18n.getValidators();
        const msg = "Debe indicar un motivo para el rechazo de la solicitud.";
        return valid.size("rechazo", data.rechazo, msg).isOk(); // Required string
    }
}
