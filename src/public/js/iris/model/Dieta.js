
import i18n from "../../i18n/langs.js";

function Dieta() {
	// nueva dieta => tipo 7 = dieta, subtipo = (1, 2 ó 3) (tipo de dia)
	this.createDiaInicial = () => ({ tipo: 7, subtipo: 1, periodo: i18n.get("firstDay") });
	this.createDiaIntermedio = () => ({ tipo: 7, subtipo: 2, periodo: i18n.get("medDay") });
	this.createDiaFinal = () => ({ tipo: 7, subtipo: 3, periodo: i18n.get("lastDay") });

	this.beforeRender = resume => {
		resume.dias = resume.impMax = resume.reducido = resume.percibir =  0;
	}

	this.row = (dieta, status, resume) => {
		console.log('dieta: ', dieta);
		resume.dias += dieta.num;
		resume.impMax += dieta.impMax;
		resume.reducido += dieta.reducido;
		resume.percibir += dieta.percibir;

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="#{msg['lbl.dia.periodo']}">${i18n.get("medDay")}</td>
			<td data-cell="#{msg['lbl.pais']}">@nombre;</td>
			<td data-cell="#{msg['lbl.fecha.inicio']}">@f1;</td>
			<td data-cell="#{msg['lbl.fecha.fin']}">@f2;</td>
			<td data-cell="#{msg['lbl.dias']}">@num;</td>
			<td data-cell="#{msg['lbl.dietas.propuestas']}">@maxDietas;</td>
			<td data-cell="#{msg['lbl.imp.dieta']}">@imp2; €</td>
			<td data-cell="#{msg['lbl.imp.propuesto']}">@impMax; €</td>
			<td data-cell="#{msg['lbl.tus.dietas']}">
			<c:choose>
				<c:when test="#{iris.form.editableP6}"><select tabindex="111">@dietas;</select></c:when>
				<c:otherwise>@imp1;</c:otherwise>
			</c:choose>
			</td>
			<td data-cell="#{msg['lbl.imp.reduccion']}">@reducido; €</td>
			<td data-cell="#{msg['lbl.imp.tot']}">@percibir; €</td>
		</tr>`;
	}

	this.change = (dieta, el, tr, dietas) => {
		dieta.imp1 = +el.value;
		table.reload();
	}
}

export default new Dieta();
