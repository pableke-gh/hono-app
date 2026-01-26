
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import Solicitud from "../../xeco/model/Solicitud.js";
import perfiles from "../data/perfiles/perfiles.js"; 

class Iris extends Solicitud {
	build = () => new Iris(); // Override create a new instance
	getUrl = () => "/uae/iris"; // endpoint base path
	setData(data) { // Override
		const parts = sb.split(super.setData(data).getPerfil()); // ROL/COLECTIVO/ACTIVIDAD/TRAMITE/FINANCIACION
		return parts ? this.setPerfil(parts[0], parts[1], parts[2], parts[3], parts[4]) : this;
	}

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

	getTitulo = () => perfiles.getTitulo(this.getRol(), this.getColectivo(), this.getActividad(), this.getTramite(), this.getFinanciacion());
	getPerfil = () => this.get("perfil");
	setPerfil = (rol, colectivo, actividad, tramit, financiacion) => {
		this.set("rol", rol).set("colectivo", colectivo).set("actividad", actividad).set("tramite", tramit).setFinanciacion(financiacion);
		return this.set("perfil", rol + "," + colectivo + "," + actividad + "," + tramit + "," + financiacion);
	}

	isConflicto = () => (this.getMask() & 2); //existen solicitudes previas a nombre del interesado coincidentes en fechas?
	isPaso8 = () => (this.getMask() & 4); // paso 8 activado manualmente por la uae
	isMaxVigencia = () => (this.getMask() & 8); //maxima fecha de vigencia en rrhh
	getNumRutasVp = globalThis.void; // redefined by index module

	// render steps functions for tabs
	getPaso1 = () => i18n.render(i18n.set("paso", 1).get("lblPasos"), this);
	getPasoIsu = () => i18n.render(i18n.set("paso", i18n.get("paso") + this.isIsu()).get("lblPasos"), this);
	getPaso = () => i18n.render(i18n.set("paso", i18n.get("paso") + 1).get("lblPasos"), this);
	getPasoMaps = globalThis.void; // redefined by perfil module

	row = data => {
		let acciones = Solicitud.prototype.row.call(this, data);
		if (this.isDocumentable()) {
			if (this.isAdmin()) {
				acciones += '<a href="#rptFinalizar" title="Consulta los datos de la solicitud"><i class="fas fa-clipboard-list action text-blue resize"></i></a>'; 
				//acciones += '<a href="#pdf" title="Informe IRIS"><i class="fas fa-file-pdf action text-red resize"></i></a>';
			}
			acciones += '<a href="#report" title="Informe IRIS"><i class="fal fa-file-pdf action text-red resize"></i></a>';
		}
		if (this.isReactivable())
			acciones += '<a href="#reset" title="Subsanar la comunicación"><i class="far fa-edit action text-blue resize"></i></a>';
		if (this.isActivablePaso8())
			acciones += '<a href="#paso8" title="Activar Otras Indemnizaciones Extraordinarias (paso 8)"><i class="fas fa-plus action text-green resize"></i></a>';

		const info = this.isUrgente() ? `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>` : "<td></td>";
		const otras = this.isMultilinea() ? "<span> (y otras)</span>" : "";
		return `<tr class="tb-data">
			${info}
			<td class="text-center"><a href="#view" title="${data.codigo}: ${data.name}">${sb.substr(data.codigo, 0, 9)}</a></td>
			<td class="${this.getStyleByEstado()} table-refresh" data-refresh="text-render" data-template="@getDescEstado;">${this.getDescEstado()}</td>
			<td class="text-center">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="hide-sm">${data.org}<span class="hide-sm"> ${data.oDesc}</span>${otras}</td> 
			<td class="hide-sm">${data.interesado}</td>
			<td class="hide-md">${data.memo || ""}</td>
			<td class="currency">${i18n.isoFloat(data.imp) || "-"} €</td>
			<td class="currency no-print">${acciones}</td>
		</tr>`;
	}
}

export default new Iris();
