
import i18n from "../../i18n/langs.js";

const TICKETS = ["-", "Peaje", "Aparcamiento", "Metro", "Taxi", "Autobús Urbano", "Tranvía", "Otros", "-", "-", "Tickets de transporte (taxi, parking, peajes...)"];
const DOCS = ["-", "Documentación obligatoria por ausencia de facturas", "Otra documentación (opcional)", "Justificación de dietas", "Facturas a nombre de la UPCT a pagar al proveedor", "Facturas a nombre de la UPCT a pagar al comisionado", "Documentación acreditativa del programa de movilidad"]
const EXTRA = ["-", "Gasto extraordinario por transporte", "Gasto extraordinario por alojamiento", "Gasto extraordinario por cena final españa", "Gasto extraordinario por otras dietas"];
const ORGANICAS = ["-", "Dietas", "Alojamiento", "Transporte", "Asistencias"];

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

		let subtipo = self.isFactura(gasto) ? "Factura a nombre del comisionado por transporte interurbano" : "";
		subtipo = self.isTicket(gasto) ? (TICKETS[gasto.subtipo] || TICKETS[0]) : subtipo;
		subtipo = self.isPernocta(gasto) ? "Factura a nombre del comisionado por alojamiento" : subtipo;
		subtipo = self.isDoc(gasto) ? (DOCS[gasto.subtipo] || DOCS[0]) : subtipo;

		let desc = self.isFactura(gasto) ? `${i18n.isoInt(gasto.num)} etapa/s asociados al gasto` : gasto.desc;
		desc = self.isTicket(gasto) ? (TICKETS[gasto.subtipo] || TICKETS[0]) : desc;
		desc = self.isPernocta(gasto) ? `Noches del ${i18n.isoDate(gasto.f1)} al ${i18n.isoDate(gasto.f2)}` : desc;
		// todo: faltan subtipos y descripciones ......
console.log(gasto, subtipo, desc);

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.tipo.gasto']}">${subtipo}</td>
			<td data-cell="#{msg['lbl.desc.obsev']}">${desc}</td>
			<td data-cell="#{msg['lbl.adjunto']}">${gasto.nombre}</td>
			<td data-cell="#{msg['lbl.importe']}">${i18n.isoFloat(gasto.imp1)} €</td>
			<td class="no-print" data-cell="Acciones">${link}${remove}</td>
		</tr>`;
	}
	this.tfoot = resume => {
		return `<tr><td colspan="99">Documentos: ${resume.size}</td></tr>`; 
	}
}

export default new Gasto();
