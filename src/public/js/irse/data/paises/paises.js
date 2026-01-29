
import i18n from "../../i18n/langs.js";
import es from "./paises-es.js";
import en from "./paises-en.js";

export default {
	getPaises: () => i18n.isDefault() ? en.getPaises() : es.getPaises(), 
	getPais: pais => i18n.isDefault() ? en.getPais(pais) : es.getPais(pais),

	getRegiones: () => i18n.isDefault() ? en.getRegiones() : es.getRegiones(),  
	getRegion: pais => i18n.isDefault() ? en.getRegion(pais) : es.getRegion(pais)
}
