
import i18n from "../../i18n/langs.js";
import iris from "../Iris.js";

function Gasto() {
	const self = this; //self instance

	this.isFactura = gasto => (gasto.tipo == 1);
	this.isTicket = gasto => (gasto.tipo == 2);
	this.isTaxi = gasto => (self.isTicket(gasto) && (gasto.subtipo == 4));
	this.isTaxiJustifi = gasto => (self.isTaxi(gasto) && gasto.desc);
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
	this.isOrganica = gasto => (gasto.tipo == 19); // paso 9 = multiorganica
	this.isOrganicaDieta = gasto => (self.isOrganica(gasto) && (gasto.subtipo == 1)); // paso 9 = multiorganica dieta = 1
	this.isOrganicaPernocta = gasto => (self.isOrganica(gasto) && (gasto.subtipo == 2)); // paso 9 = multiorganica pernocta = 2
	this.isOrganicaTrans = gasto => (self.isOrganica(gasto) && (gasto.subtipo == 3)); // paso 9 = multiorganica transporte = 3
	this.isOrganicaAc = gasto => (self.isOrganica(gasto) && (gasto.subtipo == 4)); // paso 9 = multiorganica asistencias = 4

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

	this.getTipoSubv = gasto => gasto?.estado; // _gSubv = tipo subv. = estado
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
	this.getF1Cong = gasto => gasto?.f1; // _gCongreso = fecha inicio congreso = f1
	this.getF2Cong = gasto => gasto?.f2; // _gCongreso = fecha fin congreso = f2
	this.getJustifiCong = gasto => gasto?.desc; // _gCongreso = justificacion congreso = desc
	this.setCongreso = (gCongreso, data) => {
		gCongreso.estado = data.tipoCongreso;
		gCongreso.imp1 = data.impInsc;
		gCongreso.f1 = data.f1Cong;
		gCongreso.f2 = data.f2Cong;
		gCongreso.desc = data.justifiCong;
		return self;
	}

	this.getImpAc = gasto => gasto?.imp1; // _gAc = importe de la asistencia / colaboracion = imp1
	this.getJustifiVp = gasto => gasto?.desc; // _gAc = justificacion VP = desc
	this.setAsistencia = (gAc, data) => {
		//gAc.imp1 = data.impAc; // importe de la asistencia / colaboracion paso 3 (a futuro)
		gAc.desc = data.justifiVp; // justificación del uso del vehiculo propio paso 3
		return self;
	}

	this.getGrupoDieta = gasto => gasto?.subtipo; // _gIban = grupo de la dieta = subtipo (default = 2)
	this.getTipoDieta = gasto => gasto?.estado; // _gIban = tipo de dieta = estado (RD = 1, EUT = 2, UPCT = 9)
	this.getCodigoIban = gasto => gasto?.nombre; // _gIban = codigo iban (XXXX-XXXX-XXXX-XXXX) = nombre
	this.getSwift = gasto => gasto?.cod; // _gIban = swift = cod = id_fichero
	this.getObservaciones = gasto => gasto?.desc; // _gIban = observaciones = desc
	this.setIban = (gIban, data) => {
		gIban.subtipo = data.grupoDieta;
		//gIban.estado = data.tipoDieta; // autocalculado por la organica en el servidor
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
		resume.noches += self.isPernocta(data) ? data.num : 0;
		resume.numTransportes += self.isTransporte(data);
		resume.numPernoctas += self.isPernocta(data);
		resume.adjuntos += globalThis.isset(data.fref);
		resume.docComisionado += self.isDocComisionado(data);
		resume.otraDoc += self.isOtraDoc(data);
	}

	this.getDescSubtipo = data => {
		if (self.isFactura(data))
			return i18n.get("lblFactTransporte");
		if (self.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		if (self.isPernocta(data))
			return i18n.get("lblFactAlojamiento");
		if (self.isExtra(data))
			return i18n.getItem("tipoExtra", data.subtipo) || "-";
		return self.isDoc(data) ? i18n.getItem("tipoDocs", data.subtipo) : data.desc;
	}
	this.getDescSubtipoImp = data => {
		return self.getDescSubtipo(data) + ": " + i18n.isoFloat(data.imp1) + " €";
	}
	this.getDescGasto = data => {
		if (self.isFactura(data))
			return i18n.render(i18n.get("lblFactRutas"), data);
		if (self.isTaxiJustifi(data)) // descripcion del itinerario del taxi
			return data.desc;
		if (self.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		return self.isPernocta(data) ? i18n.render(i18n.get("lblRangoNoches"), data) : data.desc;
	}

	this.row = (data, status, resume) => {
		self.rowCalc(data, resume);
		const link = `<a href="#adjunto" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = iris.isEditable() ? `<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>` : "";

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${self.getDescSubtipo(data)}</td>
			<td data-cell="${i18n.get("lblDescObserv")}">${self.getDescGasto(data)}</td>
			<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1) ?? "-"} €</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print"><span>${link}${remove}</span></td>
		</tr>`;
	}

	this.getTable = () => ({ msgEmptyTable: "msgGastosEmpty", beforeRender: self.beforeRender, rowCalc: self.rowCalc, onRender: self.row });
}

export default new Gasto();
