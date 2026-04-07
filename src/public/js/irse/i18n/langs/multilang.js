
import Multilang from "../../../i18n/langs/multilang.js";

export default class IrisMultilang extends Multilang {
	getPerfil(rol, colectivo, actividad, tramite, financiacion) {
		return super.getLang().getPerfil(rol, colectivo, actividad, tramite, financiacion);
	}

	getPaises() { return super.getLang().getPaises(); }
	getPais(pais) { return super.getLang().getPais(pais); }

	getRegiones() { return super.getLang().getRegiones(); }
	getRegion(region) { return super.getLang().getRegion(region); }
}
