
import Lang from "../../../../i18n/langs/en/lang.js";
import en from "./en.js";

class PrestoLang extends Lang {
	get(key) { return (en[key] || super.get(key)); }
}

export default new PrestoLang();
