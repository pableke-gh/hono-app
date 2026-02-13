
import dt from "../../../components/types/DateBox.js";
import nb from "../../../components/types/NumberBox.js";
import Base from "../lang.js";
import en from "./en.js";

export default class Lang extends Base {
	getLang = () => en;
	get(key) { return en[key]; }
	msg(key) { return (en[key] ?? key); }
	set(name, msg) { en[name] = msg; return this; }

	// Date formats
	isoDate = str => str && str.substring(0, 10); //Iso string = yyyy-mm-dd
	strDate = date => date && dt.isoDate(date); //Date type to iso string = yyyy-mm-dd

	// Float formats
	toFloat = str => nb.toFloat(str, ".");  // String to Float instance
	floatval = str => nb.floatval(str, ".");  // String to native float

	// Float to String formated
	#float = (num, n) => nb.isoFloat(num, n, "en");
	isoFloat = num => this.#float(num, 2);
	isoFloat1 = num => this.#float(num, 1);
	isoFloat2 = num => this.#float(num, 2);
	isoFloat3 = num => this.#float(num, 3);

	// String to EN String formated
	#reformat = (str, n) => nb.fmtFloat(str, ".", n, "en");
	fmtFloat = (str, n) => this.#reformat(str, n ?? 2);
	fmtFloat1 = str => this.#reformat(str, 1);
	fmtFloat2 = str => this.#reformat(str, 2);
	fmtFloat3 = str => this.#reformat(str, 3);

	// Int formats
	isoInt = num => nb.isoInt(num, "en"); // Int to String formated
	fmtInt = str => nb.fmtInt(str, "en"); // String to EN String formated
}
