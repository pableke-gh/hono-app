
import i18n from "../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import Solicitud from "../../xeco/model/Solicitud.js";

class Presto extends Solicitud {
	build = () => new Presto(); // Override create a new instance
	getUrl = () => "/uae/presto"; // Override base url path
	isValid(data) { return super.isValid(data) && data.ejercicios; }

	getTitulo = () => i18n.getItem("descTipos", this.getTipo());
	isTcr = () => (this.getTipo() == 1);
	isFce = () => (this.getTipo() == 6);
	isL83 = () => (this.getTipo() == 3);
	isGcr = () => (this.getTipo() == 4);
	isAnt = () => (this.getTipo() == 5);
	isAfc = () => (this.getTipo() == 8);
	is030 = () => (this.isUae() && (this.isGcr() || this.isAnt()));

	isIntegrable = () => (!this.isAfc() && this.isIntegrableSolicitud());
	isReactivable = () => (this.isUae() && !this.isAfc() && !this.isFce() && this.isErronea());
	isImpCd = () => (this.isEditable() && !this.isAnt());
	getAdjunto = () => this.get("file");

	isPartidaDec = () => (this.isTcr() || this.isL83() || this.isAnt() || this.isAfc());
	isTipoMultipartida = () => (this.isTcr() || this.isFce() || this.isGcr());
	showPartidasInc = () => (this.isTipoMultipartida() && this.isEditable() /*&& (partidas.size() < 20)*/);
	isPartidaExt = () => (this.isGcr() || this.isAnt());
	isDisableEjInc = () => (this.isDisabled() || this.isTcr() /*|| this.isFce()*/);
	isAutoLoadImp = () => (this.isL83() || this.isAnt() || this.isAfc());
	isAutoLoadInc = () => (this.isL83() || this.isAnt());
	isTransferencia = () => (this.isTcr() || this.isL83() || this.isFce());
	isGeneracion = () => (this.isGcr() || this.isAnt());
	isAnticipada = () => (this.getMask() & 4);
	isExcedida = () => (this.getMask() & 8);

	row = data => {
		let acciones = Solicitud.prototype.row.call(this, data);
		if (this.isDocumentable()) {
			//acciones += this.isAdmin() ? '<a href="#pdf" title="Informe PRESTO"><i class="fas fa-file-pdf action resize text-red"></i></a>' : "";
			acciones += '<a href="#report" title="Informe PRESTO"><i class="fal fa-file-pdf action resize text-red"></i></a>';
		}

		let info = '<td></td>';
		if (this.isUrgente())
			info = `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>`;
		if ((this.isUae() || this.isOtri()) && this.isAnticipada())
			info = '<td class="text-center text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</td>';
		if ((this.isUae() || this.isOtri()) && this.isExcedida())
			info = '<td class="text-center text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</td>';

		const otras = this.isMultilinea() ? "<span> (y otras)</span>" : "";
		return `<tr class="tb-data">
			${info}
			<td class="text-center"><a href="#view">${data.codigo}</a></td>
			<td class="hide-sm">${this.getTitulo()}</td>
			<td class="${this.getStyleByEstado()} hide-xs table-refresh" data-refresh="update-estado">${this.getDescEstado()}</td>
			<td class="text-center hide-xs">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td title="${data.oIncDesc}">${data.orgInc}${otras}</td>
			<td class="text-center hide-xs" title="${data.eIncDesc}">${data.ecoInc}</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="hide-sm">${data.name}</td>
			<td class="hide-md">${data.memo}</td>
			<td class="currency no-print">${acciones}</td>
		</tr>`;
	}
}

export default new Presto();
