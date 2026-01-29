
import Lang from "../../../../i18n/langs/es/lang.js";
import es from "./es.js";

class IrisLang extends Lang {
	get = key => (es[key] || Lang.prototype.get.call(this, key));
}

export default new IrisLang();
