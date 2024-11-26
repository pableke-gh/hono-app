
import i18n from "../../../i18n/langs.js";

export default function Partida(presto) {
	const self = this; //self instance

    let data; // Current presto data type
    this.getData = () => data;
    this.setData = partida => { data = partida; return self; }

    this.isAnticipada = partida => (partida.mask & 4);
    this.isExcedida = partida => ((presto.isAnt() || (partida.e == "642")) && Number.isNumber(partida.ih) && ((partida.ih + .01) < partida.imp));
    this.isAfectada = mask => (mask & 1); // Es afectada? Si/No

    this.thead = () => {
        const output = presto.isPartidaExt() ? '<th>Prev. Ingresos (A)</th><th>GG &#37; (B)</th><th>Max. Habilitar (C=A-B)</th><th>Crédito Habilitado (D)</th><th>Margen (E=C-D)</th>' : "";
        return `<tr>
            <th></th>
            <th>Ej.</th>
            <th>Orgánica</th>
            <th class="hide-sm">Descripción Orgánica</th>
            <th class="hide-sm">FA</th>
            <th>Eco.</th>
            <th class="hide-sm">Descripción Económica</th>
            ${output}
            <th>Importe</th>
            <th></th>
        </tr>`;
    }
    this.row = (data, status, resume) => {
        const NO_APLICA = "N/A"; // default table float
        const excedido = self.isExcedida(data) ? '<span class="text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</span>' : "";
        const anticipada = self.isAnticipada(data) ? '<span class="text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</span>' : "";
        const doc030 = presto.is030() ? '<a href="#doc030" class="fal fa-money-bill-alt action resize text-green row-action" title="Asociar los datos del documento 030"></a>' : "";
        const remove = (presto.isEditable() && !presto.isAfc()) ? '<a href="#remove" class="fas fa-times action resize text-red row-action" title="Desasociar partida"></a>' : "";
        resume.imp += data.imp; // sum

        let output = "";
        if (presto.isPartidaExt()) {
            output = `<td class="text-right">${i18n.isoFloat(data.ing) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.gg) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.mh) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.ch) || NO_APLICA} €</td>
                        <td class="text-right">${i18n.isoFloat(data.ih) || NO_APLICA} €</td>`;
        }
        return `<tr class="tb-data">
            <td class="text-center">${excedido}${anticipada}</td>
            <td class="text-center">${data.ej}</td>
            <td>${data.o}</td>
            <td class="hide-sm">${data.dOrg}</td>
            <td class="text-center hide-sm">${i18n.boolval(self.isAfectada(data.omask))}</td>
            <td class="text-center">${data.e}</td>
            <td class="hide-sm">${data.dEco}</td>
            ${output}
            <td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center">${doc030}${remove}</td>
        </tr>`;
    }
    this.tfoot = resume => {
        const output = presto.isPartidaExt() ? '<td></td><td></td><td></td><td></td><td></td>' : "";
        return `<tr>
            <td colspan="3">Partidas: ${resume.size}</td>
            <td class="hide-sm"></td><td class="hide-sm"></td><td></td><td class="hide-sm"></td>
            ${output}
            <td class="text-right">${i18n.isoFloat(resume.imp)} €</td><td></td>
        </tr>`;
    }

    this.validate = data => {
        const valid = i18n.getValidators();
        valid.isKey("acOrgInc", data.idOrgInc, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
        valid.isKey("idEcoInc", data.idEcoInc, "Debe seleccionar una económica"); // select required number
        valid.gt0("impInc", data.impInc); // float number > 0
        return valid.close("No ha seleccionada correctamente la partida a incrementar.");
    }
}
