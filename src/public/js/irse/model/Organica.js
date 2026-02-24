
import sb from "../../components/types/StringBox.js";

const ORG_300518 = "300518"; // organica investigacion

class Organica {
	// tipos de aplicacion (paso 0)
	is642 = org => (sb.starts(org.o, ORG_300518) && ((org.mask & 8) == 8));  // apli = 642
	is643 = org => (sb.starts(org.o, ORG_300518) && ((org.mask & 16) == 16)); // apli = 643
	isACA = org => ((sb.starts(org.o, "300906") || sb.starts(org.o, "300920"))); // TTPP o Master
	isInve3005 = org => (org && sb.starts(org.o, "3005") && ((org.mask & 64) == 64)); // investigacion de la 3005XX

	// tipos de imputacion (paso 9)
	isTipoDieta = tipo => (tipo == 1);
	isDieta = org => (org.subtipo == "1");
	isTipoPernocta = tipo => (tipo == 2);
	isPernocta = org => (org.subtipo == "2");
	isTransporte = org => (org.subtipo == "3");
	isAc = org => (org.subtipo == "4");
}

export default new Organica();
