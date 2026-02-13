
import Lang from "../../../../i18n/langs/en/lang.js";
import regiones from "./regiones.js";
import paises from "./paises.js";
import en from "./en.js";

import perfiles from "../../../data/perfiles/perfiles.js";
import titulos from "./perfiles.js";

class IrisLang extends Lang {
	get(key) { return (en[key] || super.get(key)); }
	msg(key) { return (en[key] || super.msg(key)); }

	getPerfil = (rol, colectivo, actividad, tramite, financiacion) => {
		return titulos[perfiles(rol, colectivo, actividad, tramite, financiacion)];
	}

	getPaises = paises.getPaises;
	getPais = paises.getPais;

	getRegiones = regiones.getRegiones;
	getRegion = regiones.getRegion;
}

export default new IrisLang();
