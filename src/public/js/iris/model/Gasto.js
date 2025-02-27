
function Gasto() {
	const self = this; //self instance

	this.isFactura = gasto => (gasto.tipo == 1);
	this.isTicket = gasto => (gasto.tipo == 2);
	this.isTransporte = gasto => (self.isFactura(gasto) || self.isTicket(gasto));
	this.isPernocta = gasto => (gasto.tipo == 6);
	this.isDieta = gasto => (gasto.tipo == 7);
	this.isExtra = gasto => (gasto.tipo == 8);
	this.isDoc = gasto => (gasto.tipo == 9);
	this.isPaso5 = gasto => self.isFactura(gasto) || self.isTicket(gasto) || self.isPernocta(gasto) || self.isExtra(gasto) || self.isDoc(gasto);

	this.row = (gasto, status, resume) => {
		const editable = window.IRSE.editable;
		const link = `<a href="${gasto.fref}" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = editable ? `<a href="#remove" class="row-action"><i class="fas fa-times action text-red resize"></i></a>` : "";

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.tipo.gasto']}">#{iris.gastos.getSubtipoDesc(g)}</td>
			<td data-cell="#{msg['lbl.desc.obsev']}">#{iris.gastos.getDescGasto(g)}</td>
			<td data-cell="#{msg['lbl.adjunto']}">${gasto.nombre}</td>
			<td data-cell="#{msg['lbl.importe']}">#{iris.gastos.getGastoImporte(g)} €</td>
			<td class="no-print" data-cell="Acciones">${link}${remove}</td>
		</tr>`;
	}
	this.tfoot = resume => {
		return `<tr><td colspan="99">Documentos: ${resume.size}</td></tr>`; 
	}
}

export default new Gasto();
