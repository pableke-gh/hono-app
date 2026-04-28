
import Base from "../../core/model/Base.js";

class Proveedor extends Base {
	getImpAplicado = () => (this.get("imp1") || 0);
	getImpPendiente = () => (this.get("imp2") || 0);
	getImpAcumulado = () => (this.getImpAplicado() + this.getImpPendiente());
	getMargen = () => (15000 - this.getImpAcumulado()); // umbral = 150000
}

export default new Proveedor();
