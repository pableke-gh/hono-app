
import sb from "../../components/types/StringBox.js";
import Usuario from "./Usuario.js";

class Buzon extends Usuario {
	#isFacturaOtros; #tipoPago; #justPagoRequired;

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
	isActiveTab4 = () => (this.isMultigrupo() || this.isFacturaOtros());
}

export default new Buzon();
