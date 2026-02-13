
import iris from "../../model/Iris.js";
import mpo from "../../model/Organica.js"; 
import organica from "../../model/gasto/Organica.js";
import gastos from "../../model/gasto/Gastos.js";

import actividad from "../perfil/actividad.js";
import organicas from "../perfil/organicas.js";
import form from "../iris.js";

function Organicas() {
	const self = this; //self instance
	const TIPO_ORGANICA = 19; // tipo de gasto = organica
	const _tblMultiorg = form.setTable("#multiorganicas", organica.getTable());

	//TIPO = dietas=1, alojamiento=2, transporte=3
	const CONCEPTOS_CAP2 = { "1": "230", "2": "230", "3": "231" };
	const SUBCONCEPTOS_CAP6 = { "1": "30", "2": "31", "3": "32" };
	//FINALIDAD = Ejecución=1, Formación=2, Difusión=3
	const FINALIDAD_AA = { "1": "30", "2": "32", "3": "31" };
	const FINALIDAD_BB = { "1": "33", "2": "35", "3": "34" };
	const FINALIDAD_CC = { "1": "36", "2": "38", "3": "37" };
	//COLECTIVOS = { "PDI-FU", "PAS", "PDI-LA", "PIN", "BPE", "ALU", "EXT" };
	const COLECTIVOS = { "PDI-FU": "00", "PDI-LA": "01", "PAS": "02", "PIN": "03", "BPE": "04", "ALU": "05", "EXT": "06" };
	//const NONE = "-"; // Sin Imputacion

	//calculo de la imputacion por orden de prelacion
	const fnCalc = (tipo, org) => {
		/*if (tipo == 4) { //Asistencias / colaboraciones = 4
			//organica de investigacion 642
			if (actividad.isIsu()) {
				if (actividad.isColaboracion())
					return "642.29";
				if (actividad.isTribunal() || actividad.isFormacion())
					return "642.39.06";
				return NONE;
			}
			//organica de investigacion 64X
			if (mpo.isInve3005(org)) {
				if (actividad.isColaboracion())
					return "64X.29";
				if (actividad.isTribunal() || actividad.isFormacion())
					return "64X.39.06";
				return NONE;
			}
			//capitulo 2
			if (actividad.isColaboracion())
				return "227.15";
			if (actividad.isTribunal())
				return "233.00.06";
			return actividad.isFormacion() ? "233.01" : "233.02";
		}*/

		let finalidad = gastos.getFinalidad() || "1"; // default = Ejecución
		if (tipo == 1) // dietas
			finalidad = FINALIDAD_AA[finalidad];
		else if (tipo == 2) // alojamiento
			finalidad = FINALIDAD_BB[finalidad];
		else // transporte
			finalidad = FINALIDAD_CC[finalidad];
		finalidad = finalidad || "XX";

		const colectivo = COLECTIVOS[actividad.getColectivo()] || "XX";
		if (actividad.isIsu()) //642
			return "642." + finalidad + "." + colectivo;
		if (mpo.isInve3005(org)) //64X
			return (mpo.is643(org) ? "643." : "64X.") + SUBCONCEPTOS_CAP6[tipo] + "." + colectivo;
		// capitulo 2
		let cap2 = CONCEPTOS_CAP2[tipo] + ".xx."  + colectivo;
		if (tipo == 1) // dietas
			return cap2.replace("xx", actividad.isMes() ? "02" : "00");
		return cap2.replace("xx", (tipo == 2) ? "01" : "00");
	}
	const fnGasto = (org, subtipo, imp1) => {
		if (imp1 > 0) // tipo de gasto con importe > 0
			gastos.push({ // nuevo gasto de tipo organica
				tipo: TIPO_ORGANICA, subtipo, imp1, num: org.id, 
				cod: org.o, nombre: fnCalc(subtipo, org), desc: org.dOrg
			});
	}

	this.view = () => {
		_tblMultiorg.render(gastos.getOrganicas());
	}

	//auto-build monoorganica
	this.build = () => {
		gastos.removeByTipo(TIPO_ORGANICA); // remove gastos de tipo organica
		const org = organicas.getOrganicas()[0]; // organica de la solicitud
		fnGasto(org, 1, iris.getImpDietas()); // dietas => sutipo = 1
		fnGasto(org, 2, iris.getImpPernoctas()); // pernoctas => sutipo = 2
		fnGasto(org, 3, iris.getImpTrans()); // transporte => sutipo = 3
		fnGasto(org, 4, gastos.getImpAc()); // asistencias => sutipo = 4
		self.view(); // actualizo la tabla de multiaplicaciones
	}
}

export default new Organicas();
