
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";
import Solicitud from "../../core/model/Solicitud.js";

class Iris extends Solicitud {
	build = () => new Iris(); // Override create a new instance
	getUrl = () => "/uae/iris"; // endpoint base path
	setData(data) { // Override
		const parts = data && sb.split(super.setData(data).getPerfil()); // ROL/COLECTIVO/ACTIVIDAD/TRAMITE/FINANCIACION
		return parts ? this.setPerfil(parts[0], parts[1], parts[2], parts[3], parts[4]) : this;
	}

	isEditableP0 = () => (!this.getId() && this.isEditable());
	isActivablePaso8 = () => (this.isUae() && this.isEditable()); // pueden mostrarse los campos del paso 8
	isReactivable = () => (sb.inYear(this.get("fCreacion")) && (this.isInvalidada() || this.isErronea())); // La solicitud se puede reactivar / subsanar
	isResumable = () => (this.isPendiente() || this.isFirmada() || this.isIntegrada()); // muestra el boton de resumen (paso 6)
	getInitTab = () => (this.isResumable() ? 6 : 0); // paso a mostrar

	getRol = () => this.get("rol");
	getCodigoRol = nif => ((nif == this.getNif()) ? "P" : "A");
	getColectivo = () => this.get("colectivo");
	getInteresado = () => this.get("interesado");
	setInteresado = data => this.set("interesado", data).setPerfil(this.getCodigoRol(data?.nif), data?.ci, this.getActividad(), this.getTramite(), this.getFinanciacion()); 
	getNombreInt = () => this.getInteresado()?.nombre;
	getNifInteresado = () => this.getInteresado()?.nif;
	getEmailInteresado = () => this.getInteresado()?.email;
	isEquipoGob = () => ((this.getInteresado()?.cargos & 64) == 64);
	getDirInteresado = () => {
		const interesado = this.isEditable() && this.getInteresado();
		const tpl = "@lblDomicilio;: @dir;, @cp;, @municipio;, @provincia; (@residencia;)";
		return interesado ? i18n.render(tpl, interesado) : null; // parser info
	}

	getActividad = () => this.get("actividad");
	isMun = () => (this.getActividad() == "MUN");
	getTramite = () => this.get("tramite");
	getFinanciacion = () => this.get("financiacion");
	setFinanciacion = val => { this.set("financiacion", val); return this; }
	isXsu = () => (this.getFinanciacion() == "xSU");
	is1su = () => (this.getFinanciacion() == "ISU");
	isIsu = () => (this.is1su() || this.isXsu());

	getTitulo = () => i18n.getPerfil(this.getRol(), this.getColectivo(), this.getActividad(), this.getTramite(), this.getFinanciacion());
	getPerfil = () => this.get("perfil");
	setPerfil = (rol, colectivo, actividad, tramit, financiacion) => {
		this.set("rol", rol).set("colectivo", colectivo).set("actividad", actividad).set("tramite", tramit).setFinanciacion(financiacion);
		return this.set("perfil", rol + "," + colectivo + "," + actividad + "," + tramit + "," + financiacion);
	}

	isConflicto = () => (this.getMask() & 2); //existen solicitudes previas a nombre del interesado coincidentes en fechas?
	isPaso8 = () => (this.getMask() & 4); // paso 8 activado manualmente por la uae
	isEditableP8 = () => (this.isEditable() && this.isPaso8()); // paso 8 y editable
	isMaxVigencia = () => (this.getMask() & 8); //maxima fecha de vigencia en rrhh

	// render steps functions for tabs
	getPaso1 = () => i18n.render(i18n.set("paso", 1).get("lblPasos"), this);
	getPasoIsu = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isIsu()).get("lblPasos"), this);
	getPaso = () => i18n.render(i18n.set("paso", i18n.get("paso") + 1).get("lblPasos"), this);
	getPasoMaps = globalThis.void; // redefined by perfil module

	// handlers for select in step 5
	getNochesPendientes = () => this.get("nochesPendientes");
	getRutasPendientes = () => this.get("rutasPendientes");
	isFacturasComisionado = () => ((this.getNochesPendientes() > 0) || (this.getRutasPendientes() > 0));
	isCenaFinal = () => this.get("cenaFinal");
}

export default new Iris();
