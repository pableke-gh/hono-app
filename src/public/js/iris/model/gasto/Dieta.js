
import dt from "../../../components/types/DateBox.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import rutas from "../../model/ruta/Rutas.js";
import dietas from "../../data/dietas/dietas.js";  

function Dieta() {
	const self = this; //self instance
	const TIPO_DIETA = 7; // tipo de gasto = dieta

	this.getTipo = () => TIPO_DIETA; // dieta / muntencion = 7
	this.getRegionName = cod => i18n.getRegion(cod); // nombre del pais de la dieta
	this.getRegion = dieta => self.getRegionName(dieta.cod); // nombre del pais de la dieta
	this.getImpDia = dieta => dieta.imp2;
	this.getDieta = dieta => dieta.imp1;

	// nueva dieta => tipo 7 = dieta, subtipo = (1, 2 ó 3) (tipo de dia), estado = 2 (dieta completa), num = 1 día, imp1 = 1 dieta
	this.createDiaInicial = () => ({ tipo: TIPO_DIETA, subtipo: 1, estado: 2, num: 1, imp1: 1, desc: i18n.get("firstDay") });
	this.createDiaIntermedio = () => ({ tipo: TIPO_DIETA, subtipo: 2, estado: 2, num: 1, imp1: 1, desc: i18n.get("medDay") });
	this.createDiaFinal = () => ({ tipo: TIPO_DIETA, subtipo: 3, estado: 2, num: 1, imp1: 1, desc: i18n.get("lastDay") });

	this.setDietaCompleta = dieta => { dieta.estado = 2; dieta.imp1 = 1; return dieta; } // poner media dieta
	this.setMediaDieta = dieta => { dieta.estado = 1; dieta.imp1 = .5; return dieta; } // poner media dieta
	this.setSinDieta = dieta => { dieta.estado = 0; dieta.imp1 = 0; return dieta; } // no hay dieta

	this.set = (dieta, fecha, tipo, grupo) => {
		dieta.cod = rutas.getPaisPernocta(fecha); // id del pais ej: ES
		dieta.nombre = self.getRegionName(dieta.cod); // nombre del pais / region ej: España (Madrid)
		dieta.imp2 = dietas.getImporte(tipo, dieta.cod, grupo); // importe dieta por dia
		dieta.f1 = dieta.f2 = dt.toPlainDateTime(fecha); // fecha en formato plano
		fecha.addDays(1); // incremento un día
		dieta.mask = 0;
		return dieta;
	}
	this.add = (dieta, fecha) => { // añadir un día más de dieta
		dieta.imp1++;
		dieta.num++;
		dieta.estado += 2; // sumo una dieta completa
		dieta.f2 = dt.toPlainDateTime(fecha); // fecha en formato plano
		fecha.addDays(1); // incremento un día
		return dieta;
	}

	this.beforeRender = resume => {
		resume.dias = resume.impMax = resume.reducido = resume.percibir =  0;
	}

	this.rowCalc = (data, resume, index) => {
		const isFirst = (index == 0);
		const isLast = ((index + 1) == resume.size);

		data.maxDietas = (isFirst || isLast) ? (data.estado / 2) : data.num;
		data.impMax = data.imp2 * data.maxDietas;
		data.reducido = isLast ? (data.imp1 ? 0 : data.impMax) : ((data.num - data.imp1) * data.imp2);
		data.percibir = data.impMax - data.reducido; 

		resume.dias += data.num;
		resume.impMax += data.impMax;
		resume.reducido += data.reducido;
		resume.percibir += data.percibir;
	}

	const fnDietas = (dieta, maxDietas) => {
		let output = '<select name="dietas">';
		for (let i = 0; i <= maxDietas; i += .5)
			output += '<option value="' + i + ((dieta == i) ? '" selected>' : '">') + i18n.isoFloat1(i) + '</option>'
		return output + "</select>";
	}
	this.row = dieta => {
		const dietas = iris.isEditable() ? fnDietas(dieta.imp1, dieta.maxDietas) : i18n.isoInt(dieta.imp1);
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="${i18n.get("lblPeriodo")}">${dieta.desc}</td>
			<td data-cell="${i18n.get("lblPais")}">${dieta.nombre}</td>
			<td data-cell="${i18n.get("lblFechaInicio")}">${i18n.isoDate(dieta.f1)}</td>
			<td data-cell="${i18n.get("lblFechaFin")}">${i18n.isoDate(dieta.f2)}</td>
			<td data-cell="${i18n.get("lblDias")}">${i18n.isoInt(dieta.num)}</td>
			<td data-cell="${i18n.get("lblDietasPropuestas")}">${i18n.isoFloat1(dieta.maxDietas)}</td>
			<td data-cell="${i18n.get("lblImpDietaDia")}">${i18n.isoFloat(dieta.imp2)} €</td>
			<td data-cell="${i18n.get("lblImpPropuesto")}">${i18n.isoFloat(dieta.impMax)} €</td>
			<td data-cell="${i18n.get("lblTusDietas")}">${dietas}</td>
			<td data-cell="${i18n.get("lblReduccion")}" class="table-refresh" data-refresh="text-render" data-template="$reducido; €">${i18n.isoFloat(dieta.reducido)} €</td>
			<td data-cell="${i18n.get("lblImpTotal")}" class="table-refresh" data-refresh="text-render" data-template="$percibir; €">${i18n.isoFloat(dieta.percibir)} €</td>
		</tr>`;
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row });
}

export default new Dieta();
