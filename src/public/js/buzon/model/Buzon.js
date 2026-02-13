
import sb from "../../components/types/StringBox.js";
import Base from "../../core/model/Base.js";

const ROL = [ "Responsable", "UXXIEC", "Comprador", "Habilidato", "Habilidato en Mis Orgánicas" ];

class Buzon extends Base {
	#isFacturaOtros; #tipoPago; #justPagoRequired;

	build = () => new Buzon(); // Override create a new instance
	load = obj => this.setData(obj.getData());  // load from other instance
	clone = () => this.build().load(this); // Override
	setUser = () => this; // to be setted externally
	getUrl = () => "/uae/buzon";

	getIdOrganica = () => this.get("org");
	getOrganica = () => this.get("oCod");
	getUnidadTramit = () => this.get("ut");

	isFacturaOtros = () => this.#isFacturaOtros;
	setFacturaOtros = val => { this.#isFacturaOtros = val; return this; }
	isIsu = () => sb.starts(this.get("oCod"), "300518") && ((this.get("omask") & 8) == 8);
	setTipoPago = tipo => { this.#tipoPago = tipo; return this; }
	isPagoProveedor = () => (this.#tipoPago == 1);
	isPagoCesionario = () => (this.#tipoPago == 2);
	isPagoUpct = () => (this.#tipoPago == 3);
	setJustPagoRequired = required => { this.#justPagoRequired = required; return this; }
	isJustPagoRequired = () => this.#justPagoRequired;

	isAnclado = data => (data.mask & 2);
	setAnclado = data => { (data.mask |= 2); return this; }
	isReciente = data => !(data.mask & 2);
	setReciente = data => { (data.mask &= ~2); return this; }
	isMonogrupo = () => !(this.getMask() & 4);
	isMultigrupo = () => (this.getMask() & 4);

	isResponsable = () => (this.get("rol") == 1);
	isUxxiec = () => (this.get("rol") == 2);
	isComprador = () => (this.get("rol") == 3);
	isHabilidato = () => (this.get("rol") == 4);
	isMisOrganicas = () => (this.get("rol") == 5);
	getRol = () => ROL[this.get("rol") - 1];
	isRemovable = () => (this.isHabilidato() && (this.get("acc") & 1));
	isFacturable = () => (this.get("acc") & 2);
	toggleFactura = () => this.set("acc", this.get("acc")^2); // The bitwise XOR operator (^)
	isReportProv = () => ( this.get("acc") & 4);
	toggleReportProv = () => this.set("acc", this.get("acc")^4);
	isIngresos = () => (this.get("acc") & 8);
	toggleIngresos = () => this.set("acc", this.get("acc")^8);
	isGastos = () => (this.get("acc") & 16);
	toggleGastos = () => this.set("acc", this.get("acc")^16);
	isPermisoUser = () => (this.get("acc") & 32);
	togglePermisoUser = () => this.set("acc", this.get("acc")^32);
	isActiveTab4 = () => (this.isMultigrupo() || this.isFacturaOtros());
}

export default new Buzon();
