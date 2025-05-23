
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";
import Base from "../../xeco/model/Base.js";
import presto from "./Presto.js";

const base = new Base(); // model instance
base.isPrincipal = partida => (partida.mask & 1);
base.setPrincipal = partida => { partida.mask |= 1; }

base.isAnticipada = partida => (partida.mask & 4);
base.isExcedida = partida => ((presto.isAnt() || (partida.e == "642")) && Number.isNumber(partida.ih) && ((partida.ih + .01) < partida.imp));
base.isAfectada = mask => (mask & 1); // Es afectada? Si/No

base.beforeRender = resume => { resume.imp = 0; }
base.thead = () => {
	const header = '<th>Prev. Ingresos (A)</th><th>GG &#37; (B)</th><th>Max. Habilitar (C=A-B)</th><th>Crédito Habilitado (D)</th><th>Margen (E=C-D)</th>';
	const output = presto.isPartidaExt() ? header : "";
	return `<tr>
		<th class="slim"></th><th>Ej.</th><th>Orgánica</th><th class="hide-sm">Descripción Orgánica</th>
		<th class="hide-sm">FA</th><th>Eco.</th><th class="hide-sm">Descripción Económica</th>
		${output}<th>Importe</th><th></th>
	</tr>`;
}
base.row = (data, status, resume) => {
	const NO_APLICA = "N/A"; // default table float
	const excedido = base.isExcedida(data) ? '<span class="text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>' : "";
	const anticipada = base.isAnticipada(data) ? '<span class="text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>' : "";
	const doc030 = presto.is030() ? '<a href="#doc030" class="fal fa-money-bill-alt action resize text-green row-action" title="Asociar los datos del documento 030"></a>' : "";
	const remove = (presto.isEditable() && !presto.isAfc()) ? '<a href="#remove" class="fas fa-times action resize text-red row-action" title="Desasociar partida"></a>' : "";
	resume.imp += data.imp; // sum

	const output = presto.isPartidaExt()
			? `<td class="text-right">${i18n.isoFloat(data.ing) || NO_APLICA} €</td>
				<td class="text-right">${i18n.isoFloat(data.gg) || NO_APLICA} €</td>
				<td class="text-right">${i18n.isoFloat(data.mh) || NO_APLICA} €</td>
				<td class="text-right">${i18n.isoFloat(data.ch) || NO_APLICA} €</td>
				<td class="text-right">${i18n.isoFloat(data.ih) || NO_APLICA} €</td>`
			: "";
	return `<tr class="tb-data">
		<td class="text-center">${excedido}${anticipada}</td>
		<td class="text-center">${data.ej}</td>
		<td>${data.o}</td>
		<td class="hide-sm">${data.dOrg}</td>
		<td class="text-center hide-sm">${i18n.boolval(base.isAfectada(data.omask))}</td>
		<td class="text-center">${data.e}</td>
		<td class="hide-sm">${data.dEco}</td>
		${output}
		<td class="text-right">${i18n.isoFloat(data.imp)} €</td>
		<td class="text-center">${doc030}${remove}</td>
	</tr>`;
}
base.tfoot = resume => {
	const output = presto.isPartidaExt() ? '<td></td><td></td><td></td><td></td><td></td>' : "";
	return `<tr>
		<td colspan="3">Partidas: ${resume.size}</td>
		<td class="hide-sm"></td><td class="hide-sm"></td><td></td><td class="hide-sm"></td>
		${output}
		<td class="text-right">${i18n.isoFloat(resume.imp)} €</td><td></td>
	</tr>`;
}
base.getTable = () => ({ beforeRender: base.beforeRender, onHeader: base.thead, onRender: base.row, onFooter: base.tfoot });

base.validate = data => {
	const valid = i18n.getValidators();
	valid.isKey("acOrgInc", data.idOrgInc, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
	valid.isKey("idEcoInc", data.idEcoInc, "Debe seleccionar una económica"); // select required number
	valid.gt0("impInc", data.impInc); // float number > 0
	if (valid.isOk() && (data.idOrgDec == data.idOrgInc) && sb.starts(sb.getCode(data.idEcoIncOption), sb.getCode(data.idEcoDecOption)))
		valid.addError("acOrgInc", "notValid", "La partida a incrementar esta dentro del nivel vinculante de la partida a decrementar. Por lo que no es necesario realizar esta operación.");
	return valid.close("No ha seleccionada correctamente la partida a incrementar.");
}

export default base;
