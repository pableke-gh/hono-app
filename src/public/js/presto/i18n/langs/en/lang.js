
import EnLang from "../../../../i18n/langs/en/lang.js";
import en from "./en.js";

class PrestoLang extends EnLang {
	get(key) { return (en[key] || super.get(key)); }
	msg(key) { return (en[key] || super.msg(key)); }
}

export default new PrestoLang();
