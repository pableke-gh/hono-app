
import i18n from "../../i18n/langs.js";
import iris from "../../model/Iris.js";

function Dieta() {
	const self = this; //self instance

	// nueva dieta => tipo 7 = dieta, subtipo = (1, 2 ó 3) (tipo de dia)
	this.createDiaInicial = () => ({ tipo: 7, subtipo: 1, periodo: i18n.get("firstDay") });
	this.createDiaIntermedio = () => ({ tipo: 7, subtipo: 2, periodo: i18n.get("medDay") });
	this.createDiaFinal = () => ({ tipo: 7, subtipo: 3, periodo: i18n.get("lastDay") });

	this.beforeRender = resume => {
		resume.dias = resume.impMax = resume.reducido = resume.percibir =  0;
	}

	this.row = (dieta, status, resume) => {
		console.log('dieta: ', dieta);
		const dietas = iris.isEditable() ? `<select name="dietas">@dietas;</select` : i18n.isoInt(dieta.imp1);

		const isFirst = (status.index == 0);
		const isLast = (status.count == resume.size);
		const maxDietas = (isFirst || isLast) ? (dieta.estado / 2) : dieta.num;
		const impMax = dieta.imp2 * maxDietas;
		const reducido = isLast ? (dieta.imp1 ? 0 : impMax) : ((dieta.num - dieta.imp1) * dieta.imp2);
		const percibir = impMax - reducido; 

		resume.dias += dieta.num;
		resume.impMax += impMax;
		resume.reducido += reducido;
		resume.percibir += percibir;

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="#{msg['lbl.dia.periodo']}">${dieta.desc}</td>
			<td data-cell="#{msg['lbl.pais']}">${dieta.nombre}</td>
			<td data-cell="#{msg['lbl.fecha.inicio']}">${i18n.isoDate(dieta.f1)}</td>
			<td data-cell="#{msg['lbl.fecha.fin']}">${i18n.isoDate(dieta.f2)}</td>
			<td data-cell="#{msg['lbl.dias']}">${i18n.isoInt(dieta.num)}</td>
			<td data-cell="#{msg['lbl.dietas.propuestas']}">${i18n.isoFloat1(maxDietas)}</td>
			<td data-cell="#{msg['lbl.imp.dieta']}">${i18n.isoFloat(dieta.imp2)} €</td>
			<td data-cell="#{msg['lbl.imp.propuesto']}">${i18n.isoFloat(impMax)} €</td>
			<td data-cell="#{msg['lbl.tus.dietas']}">${dietas}</td>
			<td data-cell="#{msg['lbl.imp.reduccion']}">${i18n.isoFloat(reducido)} €</td>
			<td data-cell="#{msg['lbl.imp.tot']}">${i18n.isoFloat(percibir)} €</td>
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
		<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.reducido)} €</td>
		<td class="tb-data-tc" data-cell="#{msg['lbl.imp.tot']}">${i18n.isoFloat(resume.percibir)} €</td>
	</tr>`;
	}

	this.getTable = () => ({ msgEmptyTable: "msgRutasEmpty", beforeRender: self.beforeRender, onRender: self.row, onFooter: self.tfoot });
}

export default new Dieta();
