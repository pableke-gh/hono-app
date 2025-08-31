
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import iris from "../../xeco/model/Solicitud.js";
import perfiles from "../data/perfiles/perfiles.js"; 

iris.getUrl = () => "/uae/iris"; // endpoint base path
iris.isActivablePaso8 = () => (iris.isUae() && iris.isEditable()); // pueden mostrarse los campos del paso 8
iris.isReactivable = () => (iris.isUae() && (iris.isInvalidada() || iris.isErronea())); // La solicitud se puede reactivar / subsanar
iris.isResumable = () => (iris.isPendiente() || iris.isFirmada() || iris.isIntegrada()); // muestra el boton de resumen (paso 6)

iris.getRol = () => iris.get("rol");
iris.getCodigoRol = nif => ((nif == iris.getNif()) ? "P" : "A");
iris.getColectivo = () => iris.get("colectivo");
iris.getInteresado = () => iris.get("interesado");
iris.setInteresado = data => iris.set("interesado", data).setPerfil(iris.getCodigoRol(data?.nif), data?.ci, iris.getActividad(), iris.getTramite(), iris.getFinanciacion()); 
iris.getNombreInt = () => iris.getInteresado()?.nombre;
iris.getNifInteresado = () => iris.getInteresado()?.nif;
iris.getEmailInteresado = () => iris.getInteresado()?.email;
iris.isEquipoGob = () => ((iris.getInteresado()?.cargos & 64) == 64);
iris.getDirInteresado = () => {
	const interesado = iris.isEditable() && iris.getInteresado();
	const tpl = "@lblDomicilio;: @dir;, @cp;, @municipio;, @provincia; (@residencia;)";
	return interesado ? i18n.render(tpl, interesado) : null; // parser info
}

iris.getActividad = () => iris.get("actividad");
iris.isMun = () => (iris.getActividad() == "MUN");
iris.getTramite = () => iris.get("tramite");
iris.getFinanciacion = () => iris.get("financiacion");
iris.setFinanciacion = val => { iris.set("financiacion", val); return iris; }
iris.getTitulo = () => perfiles.getTitulo(iris.getRol(), iris.getColectivo(), iris.getActividad(), iris.getTramite(), iris.getFinanciacion());
iris.getPerfil = () => iris.get("perfil");
iris.setPerfil = (rol, colectivo, actividad, tramit, financiacion) => {
	iris.set("rol", rol).set("colectivo", colectivo).set("actividad", actividad).set("tramite", tramit).setFinanciacion(financiacion);
	return iris.set("perfil", rol + "," + colectivo + "," + actividad + "," + tramit + "," + financiacion);
}
iris.init = data => {
	const parts = sb.split(iris.setData(data).getPerfil()); // ROL/COLECTIVO/ACTIVIDAD/TRAMITE/FINANCIACION
	return parts ? iris.setPerfil(parts[0], parts[1], parts[2], parts[3], parts[4]) : iris;
}

iris.isConflicto = () => (iris.getMask() & 2); //existen solicitudes previas a nombre del interesado coincidentes en fechas?
iris.isPaso8 = () => (iris.getMask() & 4); // paso 8 activado manualmente por la uae
iris.isMaxVigencia = () => (iris.getMask() & 8); //maxima fecha de vigencia en rrhh

iris.row = data => {
	let acciones = iris.rowActions(data);
	if (iris.isDocumentable()) {
		if (iris.isAdmin()) {
			acciones += '<a href="#rptFinalizar" class="row-action" title="Consulta los datos de la solicitud"><i class="fas fa-clipboard-list action text-blue resize"></i></a>'; 
			//acciones += '<a href="#pdf" class="row-action" title="Informe IRIS"><i class="fas fa-file-pdf action text-red resize"></i></a>';
		}
		acciones += '<a href="#report" class="row-action" title="Informe IRIS"><i class="fal fa-file-pdf action text-red resize"></i></a>';
	}
	if (iris.isReactivable())
		acciones += '<a href="#clone" class="row-action" title="Subsanar la comunicación"><i class="far fa-edit action text-blue resize"></i></a>';
	if (iris.isActivablePaso8())
		acciones += '<a href="#paso8" class="row-action" title="Activar Otras Indemnizaciones Extraordinarias (paso 8)"><i class="fas fa-plus action text-green resize"></i></a>';

	const info = iris.isUrgente() ? `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>` : "<td></td>";
	const otras = iris.isMultilinea() ? "<span> (y otras)</span>" : "";
	return `<tr class="tb-data">
		${info}
		<td class="text-center"><a href="#view" class="row-action" title="${data.codigo}: ${data.name}">${sb.substr(data.codigo, 0, 9)}</a></td>
		<td class="${iris.getStyleByEstado()} estado">${iris.getDescEstado()}</td>
		<td class="text-center">${firma.myFlag(data)}</td>
		<td class="hide-sm">${data.sig || ""}</td>
		<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
		<td class="hide-sm">${data.org}<span class="hide-sm"> ${data.oDesc}</span>${otras}</td> 
		<td class="hide-sm">${data.name}</td>
		<td class="hide-md">${data.memo || ""}</td>
		<td class="text-right">${i18n.isoFloat(data.imp) || "-"} €</td>
		<td class="text-right no-print">${acciones}</td>
	</tr>`;
}

export default iris;
