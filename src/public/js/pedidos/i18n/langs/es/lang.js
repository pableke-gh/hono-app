
import EsLang from "../../../../i18n/langs/es/lang.js";
import es from "./es.js";

class PedidoLang extends EsLang {
	get(key) { return (es[key] || super.get(key)); }
	msg(key) { return (es[key] || super.msg(key)); }
}

export default new PedidoLang();
