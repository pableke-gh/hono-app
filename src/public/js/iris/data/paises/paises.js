
import i18n from "../../../i18n/langs.js";
import es from "./paises-es.js";
import en from "./paises-en.js";

export default {
	getPais: (pais, lang) => i18n.isDefault(lang) ? en.getPais(pais) : es.getPais(pais),
	getRegion: (pais, lang) => i18n.isDefault(lang) ? en.getRegion(pais) : es.getRegion(pais)
}
