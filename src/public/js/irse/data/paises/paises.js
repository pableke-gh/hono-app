
import i18n from "../../i18n/langs.js";
import es from "./paises-es.js";
import en from "./paises-en.js";

export default {
	getPaises: lang => i18n.isDefault(lang) ? en.getPaises() : es.getPaises(), 
	getPais: (pais, lang) => i18n.isDefault(lang) ? en.getPais(pais) : es.getPais(pais),

	getRegiones: lang => i18n.isDefault(lang) ? en.getRegiones() : es.getRegiones(),  
	getRegion: (pais, lang) => i18n.isDefault(lang) ? en.getRegion(pais) : es.getRegion(pais)
}
