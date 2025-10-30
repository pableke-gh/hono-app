
import en from "./langs/en.js";
import es from "./langs/es.js";
import validators from "./validators.js";
import dt from "../components/types/DateBox.js";
import nb from "../components/types/NumberBox.js";
import sb from "../components/types/StringBox.js";

function Langs() {
	const self = this; //self instance
	const DEFAULT = "en"; // Default iso lang
	const KEYS = [ "es", DEFAULT ]; // Accepted lang keys
	const valid = validators(self); // closure

	let _current = DEFAULT; // _current = default
	let _langs, _appLangs; // All langs containers
	let _lang, _appLang; // Current language pointer

	this.getLangs = () => _langs;
	this.getLang = () => _lang;
	this.getCurrent = () => _lang;
	this.addLangs = langs => {
		_appLangs = langs;
		_appLang = _appLangs[_current];
		return self;
	}

	const findKey = lang => KEYS.find(key => (key == lang));
	const getLangKey = lang => (findKey(lang) || findKey(sb.substring(lang, 0, 2)) || DEFAULT);
	this.setLang = lang => { // Load especific language by key
		_current = getLangKey(lang);
		_appLang = _appLangs[_current];
		_lang = _langs[_current];
		return self;
	}

	this.getDefault = () => DEFAULT;
	this.getIsoLang = () => _current;
	this.isDefault = lang => (DEFAULT == (lang || _current));

	this.getIsoLangs = () => KEYS;
	this.getNavLang = () => navigator.language || navigator.userLanguage; // default browser language
	this.getLanguage = () => document.documentElement.getAttribute("lang") || self.getNavLang() || DEFAULT;
	//this.getAcceptLanguage = list => self.setLang(sb.substring(list, 0, 5)).getIsoLang(); // server header Accept-Language
	this.setLanguage = () => self.setLang(self.getLanguage()); // Set language object

	this.clone = () => new Langs();
	this.getValidation = () => valid; // Current validators
	this.getValidators = () => valid.reset(); // Init. messages
	// Create new validator instance cloning current language instance
	//this.createValidators = lang => validators(self.clone().setLang(lang));

	const fnGetMsg = msg => (_appLang[msg] || _lang[msg]);
	this.get = msg => (fnGetMsg(msg) || msg || "");
	this.getItem = (msg, index) => fnGetMsg(msg)[index];
	this.confirm = msg => msg ? confirm(self.get(msg)) : true;
	this.set = (name, msg) => { _lang[name] = msg; return self; }

	// Add i18n Date formats
	en.isoDate = str => str && str.substring(0, 10); //Iso string = yyyy-mm-dd
	es.isoDate = str => str && (str.substring(8, 10) + "/" + str.substring(5, 7) + "/" + str.substring(0, 4)); //Iso string to dd/mm/yyyy
	en.strDate = date => date && dt.isoDate(date); //Date type to iso string = yyyy-mm-dd
	es.strDate = date => date && es.isoDate(dt.isoDate(date)); //Date to string dd/mm/yyyy

	this.enDate = en.isoDate; //Iso string = yyyy-mm-dd
	this.isoTime = str => str && str.substring(11, 19); //hh:MM:ss
	this.isoTimeShort = str => str && str.substring(11, 16); //hh:MM
	this.isoDate = str => _lang.isoDate(str); // String locale date
	this.isoDateTime = str => self.isoDate(str) + " " + self.isoTime(str); //ISO date + hh:MM:ss
	this.strDate = date => _lang.strDate(date); //Date to string

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
	const RE_VAR = /[@$](\w+)(\.\w+)?;/g;
	const OPTS = { size: 1, index: 0 }; // default options
	this.render = function(str, data, opts) {
		opts = opts || OPTS;
		opts.size = opts.size || 1;
		opts.index = opts.index || 0;
		opts.count = opts.index + 1;
		opts.matches = opts.keys = 0;
		data = data || _lang; // default data = lang
		const fnValue = data.getValue || (k => (data[k]));
		return str.replace(RE_VAR, (m, k, t) => { // replacer
			opts.keys++; // always increment keys matches
			const value = fnValue(k) ?? fnGetMsg(k); // value to replace
			opts.matches += globalThis.isset(value); // increment matches
			if (m.startsWith("$")) // float / currency
				return self.isoFloat(value);
			if (t == ".d") // Object Date or Date in ISO string format
				return dt.isValid(value) ? self.strDate(value) : self.isoDate(value); // substring = 0, 10
			//if (typeof value === "function") // function type
				//return value(opts); // call function
			return (value ?? opts[k] ?? ""); // Default = String
        });
    }
	
	// Init. private vars
	_current = self.getLanguage(); // get current language
	_langs = _appLangs = { en, es }; // Default langs container
	_lang = _appLang = _langs[_current]; // Default language = en

	// Extends HTMLElement prototype
	HTMLElement.prototype.setText = function(text) { this.innerHTML = text; return this; }
	HTMLElement.prototype.setMsg = function(msg) { return this.setText(self.get(msg)); }
	HTMLElement.prototype.render = function(data, opts) {
		opts = opts || OPTS; // default options
		this.dataset.template = this.dataset.template || this.innerHTML; // save current template
		this.innerHTML = self.render(this.dataset.template, data, opts); // display new data
		return this.setVisible(opts.matches); // hide if empty
	}
	HTMLCollection.prototype.render = function(data) {
		OPTS.size = this.length; // array length
		this.forEach((el, i) => { OPTS.index = i; el.render(data, OPTS); });
		OPTS.size = OPTS.index = 0; // reset options
	}
	NodeList.prototype.render = HTMLCollection.prototype.render;
}

export default new Langs();
