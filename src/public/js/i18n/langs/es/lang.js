
import dt from "../../../components/types/DateBox.js";
import nb from "../../../components/types/NumberBox.js";
import Base from "../lang.js";
import es from "./es.js";

export default class Lang extends Base {
	get(key) { return (es[key] || key); }
	set(name, msg) { es[name] = msg; return this; }

	// Date formats
	isoDate = str => str && (str.substring(8, 10) + "/" + str.substring(5, 7) + "/" + str.substring(0, 4)); //Iso string to dd/mm/yyyy
	strDate = date => date && this.isoDate(dt.isoDate(date)); //Date to string dd/mm/yyyy

	// Float formats
	toFloat = str => nb.toFloat(str, ",");  // String to Float instance
	floatval = str => nb.floatval(str, ",");  // String to native float

	// Float to String formated
	#floatToEs = (num, n) => nb.isoFloat(num, n, "es");
	isoFloat = num => this.#floatToEs(num, 2);
	isoFloat1 = num => this.#floatToEs(num, 1);
	isoFloat2 = num => this.#floatToEs(num, 2);
	isoFloat3 = num => this.#floatToEs(num, 3);

	// String to ES String formated
	#reformat = (str, n) => nb.fmtFloat(str, ",", n, "es");
	fmtFloat = (str, n) => this.#reformat(str, 2);
	fmtFloat1 = str => this.#reformat(str, 1);
	fmtFloat2 = str => this.#reformat(str, 2);
	fmtFloat3 = str => this.#reformat(str, 3);

	// Int formats
	isoInt = num => nb.isoInt(num, "es"); // Int to String formated
	fmtInt = str => nb.fmtInt(str, "es"); // String to EN String formated
}
