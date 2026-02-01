
import Lang from "../../i18n/langs/lang.js";
import en from "./langs/en/lang.js";
import es from "./langs/es/lang.js";

class Langs extends Lang {
	getPerfil = (rol, colectivo, actividad, tramite, financiacion) => {
		return Lang.getLang().getPerfil(rol, colectivo, actividad, tramite, financiacion);
	}

	getPaises = () => Lang.getLang().getPaises();
	getPais = pais => Lang.getLang().getPais(pais);

	getRegiones = () => Lang.getLang().getRegiones();
	getRegion = region => Lang.getLang().getRegion(region);
}

export default new Langs({ en, es });
