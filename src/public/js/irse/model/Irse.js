
import coll from "../../components/CollectionHTML.js";
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";

import Solicitud from "../../core/model/Solicitud.js";
import irpf from "../util/irpf.js";

class Iris extends Solicitud {
	getUrl = () => "/uae/iris"; // endpoint base path
	setData(data) { // Override
		const parts = data && sb.split(super.setData(data).getPerfil()); // ROL/COLECTIVO/ACTIVIDAD/TRAMITE/FINANCIACION
		return coll.size(parts) ? this.setPerfil(parts[0], parts[1], parts[2], parts[3], parts[4]) : this;
	}

	isEditableP0 = () => (!this.getId() && this.isEditable());
	isActivablePaso8 = () => (this.isUae() && this.isEditable()); // pueden mostrarse los campos del paso 8
	isReactivable = () => (sb.inYear(this.get("fCreacion")) && (this.isInvalidada() || this.isErronea())); // La solicitud se puede reactivar / subsanar
	isResumable = () => (this.isPendiente() || this.isFirmada() || this.isIntegrada()); // muestra el boton de resumen (paso 6)
	getInitTab = () => (this.isResumable() ? 6 : 0); // paso a mostrar

	getRol = () => this.get("rol");
	getCodigoRol = nif => ((nif == this.getNif()) ? "P" : "A");
	getColectivo = () => this.get("colectivo");

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

	getMatricula = () => this.get("matricula");
	setMatricula = value => this.set("matricula", value);

	isConflicto = () => (this.getMask() & 2); //existen solicitudes previas a nombre del interesado coincidentes en fechas?
	isPaso8 = () => (this.getMask() & 4); // paso 8 activado manualmente por la uae
	isEditableP8 = () => (this.isEditable() && this.isPaso8()); // paso 8 y editable
	isMaxVigencia = () => (this.getMask() & 8); //maxima fecha de vigencia en rrhh

	getInteresado = () => this.get("interesado");
	setInteresado = data => this.set("interesado", data).set("colectivo", data?.ci); 
	getNombreInt = () => this.getInteresado()?.nombre;
	getNifInteresado = () => this.getInteresado()?.nif;
	getEmailInteresado = () => this.getInteresado()?.email;
	getCargos = () => this.getInteresado()?.cargos; // cargos del interesado (bitmask)
	isEquipoGob = () => ((this.getCargos() & 64) == 64); // el interesado forma parte del equipo de gobierno
	getDirInteresado = () => i18n.render("@lblDomicilio;: @dir;, @cp;, @municipio;, @provincia; (@residencia;)", this.getInteresado()); // parser info

	// render steps functions for tabs
	getPaso1 = () => i18n.render(i18n.set("paso", 1).get("lblPasos"), this);
	getPasoIsu = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isIsu()).get("lblPasos"), this);
	getPaso = () => i18n.render(i18n.set("paso", i18n.get("paso") + 1).get("lblPasos"), this);
	getPasoMaps = globalThis.void; // redefined by perfil module

	// handlers for select in step 5
	getNochesPendientes = () => 0;
	getNumRutasPendientes = () => 0;
	isFacturasComisionado = () => ((this.getNochesPendientes() > 0) || (this.getNumRutasPendientes() > 0));

	// params from server
	getImpTransporte = () => 0;
	getImpPernoctas = () => 0;
	getImpDietas = () => 0;
	getImpExtraTrans = () => 0;
	getImpExtraPernoctas = () => 0;
	getImpExtraDietas = () => 0;
	getImpCena = () => 0;
	isCenaFinal = () => false;
	getTotAc = () => 0;
	getIrpf = () => irpf.getIrpf(this.getInteresado(), this.getActividad());
}

export default new Iris();
