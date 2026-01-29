
import Lang from "../../../../i18n/langs/en/lang.js";
import en from "./en.js";

class PrestoLang extends Lang {
	get = key => (en[key] || Lang.prototype.get.call(this, key));
}

export default new PrestoLang();
