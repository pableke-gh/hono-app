
import i18n from "../../i18n/langs.js";
import iris from "../../model/Iris.js";
import paises from "../../data/paises/paises.js";

function Dieta() {
	const self = this; //self instance

	this.getRegion = dieta => paises.getRegion(dieta.cod); // nombre del pais de la dieta
	this.getImpDia = dieta => dieta.imp2;
	this.getDieta = dieta => dieta.imp1;

	// nueva dieta => tipo 7 = dieta, subtipo = (1, 2 ó 3) (tipo de dia)
	this.createDiaInicial = () => ({ tipo: 7, subtipo: 1, periodo: i18n.get("firstDay") });
	this.createDiaIntermedio = () => ({ tipo: 7, subtipo: 2, periodo: i18n.get("medDay") });
	this.createDiaFinal = () => ({ tipo: 7, subtipo: 3, periodo: i18n.get("lastDay") });

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
		let output = "";
		for (let i = 0; i <= maxDietas; i += .5)
			output += '<option value="' + i + ((dieta == i) ? '" selected>' : '">') + i18n.isoFloat1(i) + '</option>'
		return output;
	}
	this.row = (dieta, status, resume) => {
		console.log('dieta: ', dieta);
		self.rowCalc(dieta, resume, status.index);
		const dietas = iris.isEditable() ? `<select name="dietas">${fnDietas(dieta.imp1, dieta.maxDietas)}</select>` : i18n.isoInt(dieta.imp1);
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

	this.tfoot = resume => {
		return `<tr>
		<td class="hide-xs" colspan="4">Dietas / manutención</td>
		<td class="tb-data-tc hide-xs">${resume.dias}</td>
		<td></td>
		<td></td>
		<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.impMax)} €</td>
		<td></td>
		<td class="tb-data-tc hide-xs table-refresh" data-refresh="text-render" data-template="$reducido; €">${i18n.isoFloat(resume.reducido)} €</td>
		<td data-cell="${i18n.get("lblImpTotal")}" class="tb-data-tc table-refresh" data-refresh="text-render" data-template="$percibir; €">${i18n.isoFloat(resume.percibir)} €</td>
	</tr>`;
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new Dieta();
