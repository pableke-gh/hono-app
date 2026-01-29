
import Lang from "./langs/lang.js";

class Langs extends Lang {
	#langs; // all accepted languages

	getLanguage = () => document.documentElement.getAttribute("lang") || navigator.language || "es";
	setLang(lang) { // Load especific language by key
		lang = lang || this.getLanguage(); // get key lang (es, en, etc.)
		Lang.setLang(lang.startsWith("en") ? this.#langs.en : this.#langs.es); // default es
		return this;
	}
	setLangs(langs, lang) {
		this.#langs = langs; // init. languages
		return this.setLang(lang); // set current language
	}
}

export default new Langs();
