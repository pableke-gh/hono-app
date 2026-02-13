
import i18n from "../i18n/langs.js";
import Solicitud from "../../core/model/Solicitud.js";

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
}

export default new Presto();
