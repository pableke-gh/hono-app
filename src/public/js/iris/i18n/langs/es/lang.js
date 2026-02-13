
import Lang from "../../../../i18n/langs/es/lang.js";
import regiones from "./regiones.js";
import paises from "./paises.js";
import es from "./es.js";

import perfiles from "../../../data/perfiles/perfiles.js";
import titulos from "./perfiles.js";

class IrisLang extends Lang {
	get(key) { return (es[key] || super.get(key)); }
	msg(key) { return (es[key] || super.msg(key)); }

	getPerfil = (rol, colectivo, actividad, tramite, financiacion) => {
		return titulos[perfiles(rol, colectivo, actividad, tramite, financiacion)];
	}

	getPaises = paises.getPaises;
	getPais = paises.getPais;

	getRegiones = regiones.getRegiones;
	getRegion = regiones.getRegion;
}

export default new IrisLang();
