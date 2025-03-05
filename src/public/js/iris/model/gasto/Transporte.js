
function Transporte() {

	this.beforeRender = resume => {
		resume.numNoches = 0;
	}
	this.row = (data, status, resume) => {
		resume.numNoches += data.num;
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.tipo.gasto']}">#{irse.gastos.getSubtipoDesc(g)}</td>
			<td data-cell="#{msg['lbl.desc.obsev']}">#{irse.gastos.getDescGasto(g)}</td>
			<td data-cell="#{msg['lbl.adjunto']}">#{g.nombre}</td>
			<td data-cell="#{msg['lbl.importe']}">#{irse.gastos.getGastoImporte(g)} €</td>
		</tr>`
	}
	this.tfoot = resume => {
		return `<tr>
			<td colspan="4">Facturas / Tickets: ${resume.size}</td>
			<td class="tb-data-tc hide-xs">#{irse.gastos.impTransporteI18n} €</td>
		</tr>`;
	}
}

export default new Transporte();
