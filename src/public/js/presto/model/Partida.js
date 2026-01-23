
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";
import presto from "./Presto.js";

class Partida {
	isPrincipal = partida => (partida.mask & 1);
	setPrincipal = partida => { partida.mask |= 1; }

	isAnticipada = partida => (partida.mask & 4);
	isExcedida = partida => ((presto.isAnt() || (partida.e == "642")) && Number.isNumber(partida.ih) && ((partida.ih + .01) < partida.imp));
	isAfectada = mask => (mask & 1); // Es afectada? Si/No

	beforeRender = resume => { resume.imp = 0; }
	rowCalc = (data, resume) => { resume.imp += data.imp; }
	row = (data, status, resume) => {
		this.rowCalc(data, resume);
		const NO_APLICA = "N/A"; // default table float
		const css = presto.isPartidaExt() ? "currency" : "hide";
		const excedido = this.isExcedida(data) ? '<span class="text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>' : "";
		const anticipada = this.isAnticipada(data) ? '<span class="text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>' : "";
		const doc030 = presto.is030() ? '<a href="#doc030" class="fal fa-money-bill-alt action resize text-green" title="Asociar los datos del documento 030"></a>' : "";
		const remove = (presto.isEditable() && !presto.isAfc()) ? '<a href="#remove" class="fas fa-times action resize text-red" title="Desasociar partida"></a>' : "";

		return `<tr class="tb-data">
			<td class="text-center">${excedido}${anticipada}</td>
			<td class="text-center">${data.ej}</td>
			<td>${data.o}</td>
			<td class="hide-sm">${data.dOrg}</td>
			<td class="text-center hide-sm">${i18n.boolval(this.isAfectada(data.omask))}</td>
			<td class="text-center">${data.e}</td>
			<td class="hide-sm">${data.dEco}</td>
			<td class="${css}">${i18n.isoFloat(data.ing) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.gg) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.mh) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.ch) || NO_APLICA} €</td>
			<td class="${css}">${i18n.isoFloat(data.ih) || NO_APLICA} €</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td class="text-center">${doc030}${remove}</td>
		</tr>`;
	}
	getTable = () => ({
		msgEmptyTable: "No existen partidas a incrementar asociadas a la solicitud",
		beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row
	});

	validate = data => {
		const valid = i18n.getValidators();
		valid.isKey("acOrgInc", data.idOrgInc, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
		valid.isKey("idEcoInc", data.idEcoInc, "Debe seleccionar una económica"); // select required number
		valid.gt0("impInc", data.impInc); // float number > 0
		if (valid.isOk() && (data.idOrgDec == data.idOrgInc) && sb.starts(sb.getCode(data.idEcoIncOption), sb.getCode(data.idEcoDecOption)))
			valid.addError("acOrgInc", "notValid", "La partida a incrementar esta dentro del nivel vinculante de la partida a decrementar. Por lo que no es necesario realizar esta operación.");
		return valid.close("No ha seleccionada correctamente la partida a incrementar.");
	}
}

export default new Partida();
