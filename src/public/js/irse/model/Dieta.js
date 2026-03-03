
import i18n from "../i18n/langs.js";
import importes from "../data/dietas/dietas.js";

const TIPO_DIETA = 7; // tipo de gasto = dieta

class Dieta {
	getTipo = () => TIPO_DIETA; // dieta / muntencion = 7
	getRegionName = cod => i18n.getRegion(cod); // nombre del pais de la dieta
	getRegion = dieta => this.getRegionName(dieta.cod); // nombre del pais de la dieta
	setRegion(dieta, cod) { // guardo el id + nombre del pais / region ej: España (Madrid)
		dieta.nombre = this.getRegionName(cod); // nombre del pais / region ej: España (Madrid)
		dieta.cod = cod; // id del pais ej: ES (codigo iso)
		return this;
	}

	getPais = dieta => dieta.cod; // codigo iso del pais ej: ES
	getImporte = (dieta, tipo, grupo) => importes.get(tipo, this.getPais(dieta), grupo); // importe dieta por dia (tipo, pais, grupo)
	setImporte(dieta, tipo, grupo) { dieta.imp2 = this.getImporte(dieta, tipo, grupo); return this; } // guardo el importe de la dieta
	getImpDia = dieta => dieta.imp2; // importe de la dieta por dia

	getDieta = dieta => dieta.imp1; // num dietas
	addDia(dieta) { // añadir un día más de dieta
		dieta.num++; // sumo 1 dia a la dieta
		dieta.imp1++; // dieta = [0, .5, 1, 1.5, ...]
		dieta.estado += 2; // sumo una dieta completa
	}

	// nueva dieta => tipo 7 = dieta, subtipo = (1, 2 ó 3) (tipo de dia), estado = 2 (dieta completa), num = 1 día, imp1 = 1 dieta
	createDiaInicial = () => ({ tipo: TIPO_DIETA, subtipo: 1, estado: 2, mask: 0, num: 1, imp1: 1, desc: i18n.get("firstDay") });
	createDiaIntermedio = () => ({ tipo: TIPO_DIETA, subtipo: 2, estado: 2, mask: 0, num: 1, imp1: 1, desc: i18n.get("medDay") });
	createDiaFinal = () => ({ tipo: TIPO_DIETA, subtipo: 3, estado: 2, num: 1, mask: 0, imp1: 1, desc: i18n.get("lastDay") });

	setDietaCompleta = dieta => { dieta.estado = 2; dieta.imp1 = 1; return dieta; } // poner dieta completa
	setMediaDieta = dieta => { dieta.estado = 1; dieta.imp1 = .5; return dieta; } // poner media dieta
	setSinDieta = dieta => { dieta.estado = 0; dieta.imp1 = 0; return dieta; } // no hay dieta
}

export default new Dieta();
