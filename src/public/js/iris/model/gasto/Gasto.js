
import i18n from "../../i18n/langs.js";
import iris from "../Iris.js";

const TICKETS = ["-", "Peaje", "Aparcamiento", "Metro", "Taxi", "Autobús Urbano", "Tranvía", "Otros", "-", "-", "Tickets de transporte (taxi, parking, peajes...)"];
const DOCS = ["-", "Documentación obligatoria por ausencia de facturas", "Otra documentación (opcional)", "Justificación de dietas", "Facturas a nombre de la UPCT a pagar al proveedor", "Facturas a nombre de la UPCT a pagar al comisionado", "Documentación acreditativa del programa de movilidad"]
const EXTRA = ["-", "Gasto extraordinario por transporte", "Gasto extraordinario por alojamiento", "Gasto extraordinario por cena final españa", "Gasto extraordinario por otras dietas"];
//const ORGANICAS = ["-", "Dietas", "Alojamiento", "Transporte", "Asistencias"];

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
	this.isKm = gasto => (gasto.tipo == 10); // paso 1 / 2 = matricula / km
	this.isSubvencion = gasto => (gasto.tipo == 3); // paso 3 = isu
	this.isCongreso = gasto => (gasto.tipo == 4); // paso 3 = isu
	this.isAsistencia = gasto => (gasto.tipo == 5); // paso 4 = asistencias / colaboraciones
	this.isIban = gasto => (gasto.tipo == 12); // paso 9 = liquidacion
	this.isBanco = gasto => (gasto.tipo == 13); // paso 9 = liquidacion
	this.isPaso5 = gasto => self.isFactura(gasto) || self.isTicket(gasto) || self.isPernocta(gasto) || self.isExtra(gasto) || self.isDoc(gasto);

	this.getMatricula = gasto => gasto?.cod; // _gKm = matricula = cod = id_fichero
	this.setMatricula = (gasto, matricula) => { gasto.cod = matricula; }
	this.getJustifiKm = gasto => gasto?.desc; // _gKm = justificacion exceso km = desc 
	this.setKm = (gKm, data, resumen) => {
		self.setMatricula(gKm, data.matricula);
		gKm.num = resumen.size; // nº de rutas
		gKm.estado = resumen.vp; // nº de rutas de vehiculos propios
		//gKm.subtipo = resumen.numDias; // nº de días del itinerario
		gKm.imp1 = resumen.totKm; // total km seleccionados
		gKm.imp2 = resumen.impKm; // importe total
		gKm.desc = data.justifiKm;
		return self;
	}

	this.getTipoSubv = gasto => gasto?.tipo; // _gSubv = tipo subv. = tipo
	this.getFinalidad = gasto => gasto?.subtipo; // _gSubv = finalidad = subtipo
	this.getVinc = gasto => gasto?.num; // _gSubv = vinculacion al proyecto = num
	this.getJustifi = gasto => gasto?.desc; // _gSubv = justificacion = desc
	this.setSubvencion = (gSubv, data) => {
		gSubv.tipo = data.tipoSubv;
		gSubv.subtipo = data.finalidad;
		gSubv.num = data.vinc;
		gSubv.desc = data.justifi;
		return self;
	}

	this.getTipoCongreso = gasto => gasto?.estado; // _gCongreso = congreso = estado (0, 4)
	this.getImpInsc = gasto => gasto?.imp1; // _gCongreso = importe inscripcion al congreso = imp1
	this.getJustifiCong = gasto => gasto?.desc; // _gCongreso = justificacion congreso = desc
	this.setCongreso = (gCongreso, data) => {
		gCongreso.estado = data.tipoCongreso;
		gCongreso.imp1 = data.impInsc;
		gCongreso.desc = data.justifiCong;
		return self;
	}

	this.getJustifiVp = gasto => gasto?.desc; // _gAc = justificacion VP = desc
	this.setAsistencia = (gAc, data) => {
		gAc.desc = data.justifiVp;
		return self;
	}

	this.getDieta = gasto => gasto?.estado; // _gIban = tipo de dieta = estado (default = 2)
	this.getCodigoIban = gasto => gasto?.nombre; // _gIban = codigo iban (XXXX-XXXX-XXXX-XXXX) = nombre
	this.getSwift = gasto => gasto?.cod; // _gIban = swift = cod = id_fichero
	this.getObservaciones = gasto => gasto?.desc; // _gIban = observaciones = desc
	this.setIban = (gIban, data) => {
		gIban.estado = data.dieta;
		gIban.nombre = data.iban;
		gIban.cod = data.swift;
		gIban.desc = data.observaciones;
		return self;
	}

	this.getNombreEntidad = gasto => gasto?.desc; // _gBanco = entidad (caixabank) = descripcion
	this.getPaisEntidad = gasto => gasto?.cod; // _gBanco = id pais (ES) = cod = id_fichero
	this.getCodigoEntidad = (gasto) => gasto?.nombre; // _gBanco = codigo entidad (XXXX) = nombre
	this.setBanco = (gBanco, data) => {
		gBanco.cod = data.paisEntidad; 
		gBanco.nombre = data.codigoEntidad;
		gBanco.desc = data.nombreEntidad;
		return self;
	}

	this.beforeRender = resume => {
		resume.noches = resume.numTransportes = resume.numPernoctas = 0;
		resume.adjuntos = resume.docComisionado = resume.otraDoc = 0;
	}

	this.rowCalc = (data, resume) => {
		resume.noches = self.isPernocta(data) ? data.num : 0;
		resume.numTransportes += self.isTransporte(data);
		resume.numPernoctas += self.isPernocta(data);
		resume.adjuntos += globalThis.isset(data.fref);
		resume.docComisionado += self.isDocComisionado(data);
		resume.otraDoc += self.isOtraDoc(data);
	}

	this.getDescSubtipo = data => {
		let subtipo = self.isFactura(data) ? "Factura a nombre del comisionado por transporte interurbano" : "";
		subtipo = self.isTicket(data) ? (TICKETS[data.subtipo] || TICKETS[0]) : subtipo;
		subtipo = self.isPernocta(data) ? "Factura a nombre del comisionado por alojamiento" : subtipo;
		subtipo = self.isExtra(data) ? (EXTRA[data.subtipo] || EXTRA[0]) : subtipo;
		return self.isDoc(data) ? (DOCS[data.subtipo] || DOCS[0]) : subtipo;
	}
	this.getDescGasto = data => {
		let desc = self.isFactura(data) ? `${i18n.isoInt(data.num)} etapa/s asociados al gasto` : data.desc;
		desc = self.isTicket(data) ? (TICKETS[data.subtipo] || TICKETS[0]) : desc;
		return self.isPernocta(data) ? `Noches del ${i18n.isoDate(data.f1)} al ${i18n.isoDate(data.f2)}` : desc;
	}

	this.row = (data, status, resume) => {
		self.rowCalc(data, resume);
		const link = `<a href="${data.fref}" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = iris.isEditable() ? `<a href="#rcUnloadGasto" class="row-action"><i class="fas fa-times action text-red resize"></i></a>` : "";
console.log(data);

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="#{msg['lbl.tipo.gasto']}">${self.getDescSubtipo(data)}</td>
			<td data-cell="#{msg['lbl.desc.obsev']}">${self.getDescGasto(data)}</td>
			<td data-cell="#{msg['lbl.adjunto']}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1)} €</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print">${link}${remove}</td>
		</tr>`;
	}

	this.tfoot = resume => `<tr><td colspan="99">Documentos: ${resume.size}</td></tr>`;
	this.getTable = () => ({ msgEmptyTable: "msgGastosEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row, onFooter: self.tfoot });
}

export default new Gasto();
