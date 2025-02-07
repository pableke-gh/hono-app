
import nb from "../../components/NumberBox.js";

function RutasVehiculoPropio() {
	this.row = (ruta, status, resume) => {
		resume.totKm += nb.round(ruta.km1);
		resume.totKmCalc += nb.round(ruta.km2);
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="#{msg['lbl.origen.etapa']}">${ruta.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">@f1;</td>
			<td data-cell="#{msg['lbl.hora.salida']}">@h1;</td>
			<td data-cell="#{msg['lbl.destino.etapa']}">@destino;</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">@f2;</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">@h2;</td>
			<td data-cell="#{msg['lbl.medio.trans']}">@desp;</td>
			<td data-cell="Google km">@km2;</td>
			<td data-cell="#{msg['lbl.tus.km']}">
			<c:choose>
				<c:when test="#{iris.form.editableP6}"><input type="text" value="@km1;" tabindex="100" class="ui-float tc"/></c:when>
				<c:otherwise>@km1;</c:otherwise>
			</c:choose>
			</td>
			<td data-cell="#{msg['lbl.importe']}">@impKm; €</td>
		</tr>`;
	}
}

export default new RutasVehiculoPropio();
