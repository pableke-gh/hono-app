
import irse from "../model/Irse.js";
import organica from "../model/Organica.js";
import form from "../modules/irse.js";

function IrseImputacion() {
	//const self = this; //self instance
	//TIPO = dietas=1, alojamiento=2, transporte=3
	const CONCEPTOS_CAP2 = { "1": "230", "2": "230", "3": "231" };
	const SUBCONCEPTOS_CAP6 = { "1": "30", "2": "31", "3": "32" };
	//FINALIDAD = Ejecución=1, Formación=2, Difusión=3
	const FINALIDAD_AA = { "1": "30", "2": "32", "3": "31" };
	const FINALIDAD_BB = { "1": "33", "2": "35", "3": "34" };
	const FINALIDAD_CC = { "1": "36", "2": "38", "3": "37" };
	//COLECTIVOS = { "PDI-FU", "PAS", "PDI-LA", "PIN", "BPE", "ALU", "EXT" };
	const COLECTIVOS = {
		"PDI-FU": "00", "PDI-LA": "01", "PAS": "02", 
		"PIN":    "03", "BPE":    "04", "ALU": "05", 
		"EXT":    "06"
	};
	//const NONE = "-"; // Sin Imputacion

	//const is643 = org => (org && ((org.mask & 16) == 16)); //contiene alguna aplicacion 643?

	//calculo de la imputacion por orden de prelacion
	this.get = function(tipo, org) {
		const perfil = form.getPerfil();
		/*if (tipo == 4) { //Asistencias/colaboraciones = 4
			//organica de investigacion 642
			if (perfil.isIsu()) {
				if (perfil.isColaboracion())
					return "642.29";
				if (perfil.isTribunal() || perfil.isFormacion())
					return "642.39.06";
				return NONE;
			}
			//organica de investigacion 64X
			if (organica.isInve3005(org)) {
				if (perfil.isColaboracion())
					return "64X.29";
				if (perfil.isTribunal() || perfil.isFormacion())
					return "64X.39.06";
				return NONE;
			}
			//capitulo 2
			if (perfil.isColaboracion())
				return "227.15";
			if (perfil.isTribunal())
				return "233.00.06";
			return perfil.isFormacion() ? "233.01" : "233.02";
		}*/

		let finalidad = perfil.getValue("finalidad") || "1"; //default = Ejecución
		if (organica.isTipoDieta(tipo)) // dietas
			finalidad = FINALIDAD_AA[finalidad];
		else if (organica.isTipoPernocta(tipo)) // alojamiento
			finalidad = FINALIDAD_BB[finalidad];
		else // transporte
			finalidad = FINALIDAD_CC[finalidad];
		finalidad = finalidad || "XX";
		let colectivo = COLECTIVOS[irse.getColectivo()] || "XX";

		if (perfil.isIsu()) //642
			return "642." + finalidad + "." + colectivo;
		if (organica.isInve3005(org)) //64X
			return (organica.is643(org) ? "643." : "64X.") + SUBCONCEPTOS_CAP6[tipo] + "." + colectivo;
		//capitulo 2
		let cap2 = CONCEPTOS_CAP2[tipo] + ".xx."  + colectivo;
		if (organica.isTipoDieta(tipo)) // dietas
			return cap2.replace("xx", perfil.isMes() ? "02" : "00");
		return cap2.replace("xx", organica.isTipoPernocta(tipo) ? "01" : "00");
	}
}

export default new IrseImputacion();
