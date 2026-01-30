
import Lang from "../../../../i18n/langs/es/lang.js";
import es from "./es.js";

class PrestoLang extends Lang {
	get(key) { return (es[key] || super.get(key)); }
}

export default new PrestoLang();
