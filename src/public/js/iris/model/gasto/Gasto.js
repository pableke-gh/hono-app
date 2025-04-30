
import i18n from "../../i18n/langs.js";
import iris from "../Iris.js";

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
	this.isDocJustifi = gasto => (self.isDoc(gasto) && (gasto.subtipo == 3));
	this.isDocComisionado = gasto => (self.isTransporte(gasto) || self.isPernocta(gasto) || self.isDocJustifi(gasto));
	this.isOtraDoc = gasto => (self.isDoc(gasto) && (gasto.subtipo != 3));
	this.isKm = gasto => (gasto.tipo == 10);
	this.isPaso5 = gasto => self.isFactura(gasto) || self.isTicket(gasto) || self.isPernocta(gasto) || self.isExtra(gasto) || self.isDoc(gasto);

	this.getMatricula = gasto => gasto?.cod; // matricula = cod = id_fichero

	this.beforeRender = resume => {
		resume.noches = 0;
	}
	this.rowCalc = (data, resume) => {
		resume.noches = self.isPernocta(data) ? data.num : 0;
	}

	this.row = (data, status, resume) => {
		self.rowCalc(data, resume);
		const link = `<a href="${data.fref}" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = iris.isEditable() ? `<a href="#rcUnloadGasto" class="row-action"><i class="fas fa-times action text-red resize"></i></a>` : "";

		let subtipo = self.isFactura(data) ? "Factura a nombre del comisionado por transporte interurbano" : "";
		subtipo = self.isTicket(data) ? (TICKETS[data.subtipo] || TICKETS[0]) : subtipo;
		subtipo = self.isPernocta(data) ? "Factura a nombre del comisionado por alojamiento" : subtipo;
		subtipo = self.isDoc(data) ? (DOCS[data.subtipo] || DOCS[0]) : subtipo;

		let desc = self.isFactura(data) ? `${i18n.isoInt(data.num)} etapa/s asociados al gasto` : data.desc;
		desc = self.isTicket(data) ? (TICKETS[data.subtipo] || TICKETS[0]) : desc;
		desc = self.isPernocta(data) ? `Noches del ${i18n.isoDate(data.f1)} al ${i18n.isoDate(data.f2)}` : desc;
		// todo: faltan subtipos y descripciones ......
console.log(data, subtipo, desc);

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.tipo.gasto']}">${subtipo}</td>
			<td data-cell="#{msg['lbl.desc.obsev']}">${desc}</td>
			<td data-cell="#{msg['lbl.adjunto']}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${link}${remove}</td>
		</tr>`;
	}

	this.tfoot = resume => {
		return `<tr><td colspan="99">Documentos: ${resume.size}</td></tr>`; 
	}

	this.getTable = () => ({ msgEmptyTable: "msgGastosEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new Gasto();
