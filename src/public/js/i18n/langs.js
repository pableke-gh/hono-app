
import en from "./langs/en.js";
import es from "./langs/es.js";
import Validators from "./validators.js";
import nb from "../components/types/NumberBox.js";
import sb from "../components/types/StringBox.js";

function Langs() {
	const self = this; //self instance
	const DEFAULT = "en"; // Default iso lang
	const valid = new Validators(en); // instance

	let _langs = { en, es }; // All langs
	let _lang = en; // Default language

	this.getLangs = () => _langs;
	this.getLang = () => _lang;
	this.getCurrent = () => _lang;
	this.getI18n = lang => _langs[lang] || _langs[sb.substring(lang, 0, 2)] || _lang;
	this.setLang = lang => { // Load especific language by key
		_lang = self.getI18n(lang);
		valid.setLang(_lang);
		return self;
	}

	this.addLang = function(name, lang) {
		Object.assign(_langs[name], lang);
		return self;
	}

	this.getDefault = () => DEFAULT;
	this.getIsoLang = () => _lang.lang;
	this.isDefault = lang => (!lang || (DEFAULT == lang));

	this.getIsoLangs = () => Object.keys(_langs);
	this.getNavLang = () => navigator.language || navigator.userLanguage; // default browser language
	this.getLanguage = () => document.documentElement.getAttribute("lang") || self.getNavLang() || DEFAULT;
	this.getAcceptLanguage = list => self.setLang(sb.substring(list, 0, 5)).getIsoLang(); // server header Accept-Language
	this.setLanguage = () => self.setLang(self.getLanguage()); // Set language object

	this.getValidation = () => valid; // Current validators
	this.getValidators = () => valid.reset(); // Init. messages
	this.createValidators = lang => new Validators(self.getI18n(lang)); // Create instance

	this.get = msg => _lang[msg] || msg || "";
	this.getItem = (msg, index) => _lang[msg][index];
	this.confirm = msg => msg ? confirm(self.get(msg)) : true;
	this.set = (name, msg) => { _lang[name] = msg; return self; }

	// Add i18n Date formats
	en.isoDate = str => str && str.substring(0, 10); //Iso string = yyyy-mm-dd
	es.isoDate = str => str && (str.substring(8, 10) + "/" + str.substring(5, 7) + "/" + str.substring(0, 4)); //Iso string to dd/mm/yyyy

	this.enDate = en.isoDate; //Iso string = yyyy-mm-dd
	this.isoTime = str => str && str.substring(11, 19); //hh:MM:ss
	this.isoTimeShort = str => str && str.substring(11, 16); //hh:MM
	this.isoDate = str => _lang.isoDate(str); // String locale date
	this.isoDateTime = str => self.isoDate(str) + " " + self.isoTime(str); //ISO date + hh:MM:ss

	const BOOLEAN_TRUE = ["1", "true", "yes", "on"];
	this.boolval = str => globalThis.isset(str) ? _lang.msgBool[+BOOLEAN_TRUE.includes("" + str)] : null;
	this.strval = (data, name) => data[name + "_" + _lang.lang] || data[name];

	// Float formats
	en.toFloat = str => nb.toFloat(str, ".");  // String to Float instance
	en.floatval = str => nb.floatval(str, ".");  // String to native float
	en.isoFloat = (num, n) => nb.isoFloat(num, n, _lang.lang); // Float to String formated
	en.fmtFloat = (str, n) => nb.fmtFloat(str, ".", n, _lang.lang); // String to EN String formated

	es.toFloat = str => nb.toFloat(str, ",");  // String to Float instance
	es.floatval = str => nb.floatval(str, ",");  // String to native float
	es.isoFloat = (num, n) => nb.isoFloat(num, n, _lang.lang); // Float to String formated
	es.fmtFloat = (str, n) => nb.fmtFloat(str, ",", n, _lang.lang); // String to ES String formated

	this.toFloat = str => _lang.toFloat(str);
	this.floatval = str => _lang.floatval(str);
	this.isoFloat = num => _lang.isoFloat(num);
	this.isoFloat1 = num => _lang.isoFloat(num, 1);
	this.isoFloat2 = num => _lang.isoFloat(num);
	this.isoFloat3 = num => _lang.isoFloat(num, 3);
	this.fmtFloat = str => _lang.fmtFloat(str);
	this.fmtFloat1 = str => _lang.fmtFloat(str, 1);
	this.fmtFloat2 = str => _lang.fmtFloat(str);
	this.fmtFloat3 = str => _lang.fmtFloat(str, 3);

	// Int formats
	this.toInt = nb.toInt; // String to Int instance
	this.intval = nb.intval; // String to navite integer
	this.isoInt = num => nb.isoInt(num, _lang.lang); // Int to String formated
	this.fmtInt = str => nb.fmtInt(str, _lang.lang); // String to EN String formated

	// Render styled string
	const STATUS = {};
	const RE_VAR = /[@$](\w+)(\.\w+)?;/g;
	this.render = function(str, data, i, size) {
		if (!str) // has string
			return str;
		i = i || 0;
		STATUS.index = i;
		STATUS.matches = 0;
		STATUS.count = i + 1;
		STATUS.size = size || 1;
		data = data || _lang; // default lang
		return str.replace(RE_VAR, (m, k, t) => { // remplace function
			STATUS.matches++; // increment matches
			if (m.startsWith("$") || (t == ".f")) // float
				return self.isoFloat(data[k]);
			if (t == ".d") // Date in ISO string format
				return self.isoDate(data[k]); // substring = 0, 10
			/*if (t == ".s") { // data styled by function
				const fnStyle = data[m] || _lang[m]; // handler
				return fnStyle(data[k], STATUS); // restyle data
			}*/
			return (data[k] ?? _lang[k] ?? STATUS[k] ?? ""); // Default = String
        });
    }
}

export default new Langs();
