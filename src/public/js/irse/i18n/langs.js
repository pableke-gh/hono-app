
import langs from "../../i18n/langs.js";
import IrisMultilang from "../i18n/langs/multilang.js";
import en from "./langs/en/lang.js";
import es from "./langs/es/lang.js";

const db = { en, es }; // irse langs
langs.setLangs(db); // common instance
export default new IrisMultilang(db);
