
export default class Multilang {
	#lang; #langs; // accepted languages

	constructor(langs, lang) {
		this.setLangs(langs, lang); // set current language
	}

	getLang() { return this.#lang; } // current language instance
	getData = () => this.#lang.getData(); // current BD data
	getLanguage = () => document.documentElement.getAttribute("lang") || navigator.language || "es";
	setLang(lang) { // Load especific language by key
		lang = lang || this.getLanguage(); // get key lang (es, en, etc.)
		this.#lang = lang.startsWith("en") ? this.#langs.en : this.#langs.es; // default es
		return this;
	}
	setLangs(langs, lang) {
		this.#langs = langs; // set languages collection
		return this.setLang(lang); // set current language
	}

	get(key) { return this.#lang.get(key); } // direct access to lang data
	msg(key) { return this.#lang.msg(key); } // message value from key lang
	set(name, msg) { return this.#lang.set(name, msg); } // add new message
	getItem = (key, index) => this.get(key)[index]; // get message from array index
	confirm = msg => (msg ? confirm(this.get(msg)) : true); // if no param => true confirm
	boolval = str => (globalThis.isset(str) ? this.getItem("msgBool", str ? 1 : 0) : null);

	// Date formats
	enDate = str => str && str.substring(0, 10); //yyyy-mm-dd
	isoDate = str => this.#lang.isoDate(str);
	strDate = date => this.#lang.strDate(date);
	isoTime = str => str && str.substring(11, 19); //hh:MM:ss
	isoTimeShort = str => str && str.substring(11, 16); //hh:MM
	isoDateTime = str => this.isoDate(str) + " " + this.isoTime(str); //ISO date + hh:MM:ss

	// Float formats
	toFloat = str => this.#lang.toFloat(str);
	floatval = str => this.#lang.floatval(str);

	// Float to String formated
	isoFloat = num => this.#lang.isoFloat(num);
	isoFloat1 = num => this.#lang.isoFloat1(num);
	isoFloat2 = num => this.#lang.isoFloat2(num);
	isoFloat3 = num => this.#lang.isoFloat3(num);

	// String to String formated (reformated)
	fmtFloat = (str, n) => this.#lang.fmtFloat(str, n);
	fmtFloat1 = str => this.#lang.fmtFloat1(str);
	fmtFloat2 = str => this.#lang.fmtFloat2(str);
	fmtFloat3 = str => this.#lang.fmtFloat3(str);

	// Int formats
	toInt = str => this.#lang.toInt(str); // String to Int instance
	intval = str => this.#lang.intval(str); // String to navite integer
	isoInt = num => this.#lang.isoInt(num); // Int to String formated
	fmtInt = str => this.#lang.fmtInt(str); // String to String formated (reformated)

	// Render styled string
	render = (str, data, opts) => this.#lang.render(str, data, opts);
}
