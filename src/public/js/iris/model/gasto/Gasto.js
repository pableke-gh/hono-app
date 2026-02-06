
import i18n from "../../i18n/langs.js";
import iris from "../Iris.js";

class Gasto {
	isFactura = gasto => (gasto.tipo == 1);
	isTicket = gasto => (gasto.tipo == 2);

	isTaxi = gasto => (this.isTicket(gasto) && (gasto.subtipo == 4));
	isTaxiJustifi = gasto => (this.isTaxi(gasto) && gasto.desc);
	isTipoTaxi = tipo => (tipo == "4"); //ISU y taxi

	isTransporte = gasto => (this.isFactura(gasto) || this.isTicket(gasto));
	isDieta = gasto => (gasto.tipo == 7);

	isPernocta = gasto => (gasto.tipo == 6);
	isTipoPernocta = tipo => (tipo == "9"); //Tipo pernocta

	isExtra = gasto => (gasto.tipo == 8);
	isTipoExtra = tipo => ["301", "302", "303", "304"].includes(tipo);

	isDoc = gasto => (gasto.tipo == 9);
	isTipoDoc = tipo => ["201", "202", "204", "205", "206"].includes(tipo);

	isDocJustifi = gasto => (this.isDoc(gasto) && (gasto.subtipo == 3));
	isDocComisionado = gasto => (this.isTransporte(gasto) || this.isPernocta(gasto) || this.isDocJustifi(gasto));
	isOtraDoc = gasto => (this.isDoc(gasto) && (gasto.subtipo != 3));
	isKm = gasto => (gasto.tipo == 10); // paso 1 / 2 = matricula / km
	isSubvencion = gasto => (gasto.tipo == 3); // paso 3 = isu
	isCongreso = gasto => (gasto.tipo == 4); // paso 3 = isu
	isAsistencia = gasto => (gasto.tipo == 5); // paso 4 = asistencias / colaboraciones
	isIban = gasto => (gasto.tipo == 12); // paso 9 = liquidacion
	isBanco = gasto => (gasto.tipo == 13); // paso 9 = liquidacion
	isPaso5 = gasto => this.isFactura(gasto) || this.isTicket(gasto) || this.isPernocta(gasto) || this.isExtra(gasto) || this.isDoc(gasto);
	isOrganica = gasto => (gasto.tipo == 19); // paso 9 = multiorganica
	isOrganicaDieta = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 1)); // paso 9 = multiorganica dieta = 1
	isOrganicaPernocta = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 2)); // paso 9 = multiorganica pernocta = 2
	isOrganicaTrans = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 3)); // paso 9 = multiorganica transporte = 3
	isOrganicaAc = gasto => (this.isOrganica(gasto) && (gasto.subtipo == 4)); // paso 9 = multiorganica asistencias = 4

	getMatricula = gasto => gasto?.cod; // _gKm = matricula = cod = id_fichero
	setMatricula = (gasto, matricula) => { gasto.cod = matricula; }
	getJustifiKm = gasto => gasto?.desc; // _gKm = justificacion exceso km = desc 
	setKm = (gKm, data, resumen) => {
		this.setMatricula(gKm, data.matricula);
		gKm.num = resumen.size; // nº de rutas
		gKm.estado = resumen.vp; // nº de rutas de vehiculos propios
		//gKm.subtipo = resumen.numDias; // nº de días del itinerario
		gKm.imp1 = resumen.totKm; // total km seleccionados
		gKm.imp2 = resumen.impKm; // importe total
		gKm.desc = data.justifiKm;
		return this;
	}

	getTipoSubv = gasto => gasto?.estado; // _gSubv = tipo subv. = estado
	getFinalidad = gasto => gasto?.subtipo; // _gSubv = finalidad = subtipo
	getVinc = gasto => gasto?.num; // _gSubv = vinculacion al proyecto = num
	getJustifi = gasto => gasto?.desc; // _gSubv = justificacion = desc
	setSubvencion = (gSubv, data) => {
		gSubv.tipo = data.tipoSubv;
		gSubv.subtipo = data.finalidad;
		gSubv.num = data.vinc;
		gSubv.desc = data.justifi;
		return this;
	}

	getTipoCongreso = gasto => gasto?.estado; // _gCongreso = congreso = estado (0, 4)
	getImpInsc = gasto => gasto?.imp1; // _gCongreso = importe inscripcion al congreso = imp1
	getF1Cong = gasto => gasto?.f1; // _gCongreso = fecha inicio congreso = f1
	getF2Cong = gasto => gasto?.f2; // _gCongreso = fecha fin congreso = f2
	getJustifiCong = gasto => gasto?.desc; // _gCongreso = justificacion congreso = desc
	setCongreso = (gCongreso, data) => {
		gCongreso.estado = data.tipoCongreso;
		gCongreso.imp1 = data.impInsc;
		gCongreso.f1 = data.f1Cong;
		gCongreso.f2 = data.f2Cong;
		gCongreso.desc = data.justifiCong;
		return this;
	}

	getImpAc = gasto => gasto?.imp1; // _gAc = importe de la asistencia / colaboracion = imp1
	getJustifiVp = gasto => gasto?.desc; // _gAc = justificacion VP = desc
	setAsistencia = (gAc, data) => {
		//gAc.imp1 = data.impAc; // importe de la asistencia / colaboracion paso 3 (a futuro)
		gAc.desc = data.justifiVp; // justificación del uso del vehiculo propio paso 3
		return this;
	}

	getGrupoDieta = gasto => gasto?.subtipo; // _gIban = grupo de la dieta = subtipo (default = 2)
	getTipoDieta = gasto => gasto?.estado; // _gIban = tipo de dieta = estado (RD = 1, EUT = 2, UPCT = 9)
	getCodigoIban = gasto => gasto?.nombre; // _gIban = codigo iban (XXXX-XXXX-XXXX-XXXX) = nombre
	getSwift = gasto => gasto?.cod; // _gIban = swift = cod = id_fichero
	getObservaciones = gasto => gasto?.desc; // _gIban = observaciones = desc
	setIban = (gIban, data) => {
		gIban.subtipo = data.grupoDieta;
		//gIban.estado = data.tipoDieta; // autocalculado por la organica en el servidor
		gIban.nombre = data.iban;
		gIban.cod = data.swift;
		gIban.desc = data.observaciones;
		return this;
	}

	getNombreEntidad = gasto => gasto?.desc; // _gBanco = entidad (caixabank) = descripcion
	getPaisEntidad = gasto => gasto?.cod; // _gBanco = id pais (ES) = cod = id_fichero
	getCodigoEntidad = (gasto) => gasto?.nombre; // _gBanco = codigo entidad (XXXX) = nombre
	setBanco = (gBanco, data) => {
		gBanco.cod = data.paisEntidad; 
		gBanco.nombre = data.codigoEntidad;
		gBanco.desc = data.nombreEntidad;
		return this;
	}

	beforeRender = resume => {
		resume.noches = resume.numTransportes = resume.numPernoctas = 0;
		resume.adjuntos = resume.docComisionado = resume.otraDoc = 0;
	}

	rowCalc = (data, resume) => {
		resume.noches += this.isPernocta(data) ? data.num : 0;
		resume.numTransportes += this.isTransporte(data);
		resume.numPernoctas += this.isPernocta(data);
		resume.adjuntos += globalThis.isset(data.fref);
		resume.docComisionado += this.isDocComisionado(data);
		resume.otraDoc += this.isOtraDoc(data);
	}

	getDescSubtipo = data => {
		if (this.isFactura(data))
			return i18n.get("lblFactTransporte");
		if (this.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		if (this.isPernocta(data))
			return i18n.get("lblFactAlojamiento");
		if (this.isExtra(data))
			return i18n.getItem("tipoExtra", data.subtipo) || "-";
		return this.isDoc(data) ? i18n.getItem("tipoDocs", data.subtipo) : data.desc;
	}
	getDescSubtipoImp = data => {
		return this.getDescSubtipo(data) + ": " + i18n.isoFloat(data.imp1) + " €";
	}
	getDescGasto = data => {
		if (this.isFactura(data))
			return i18n.render(i18n.get("lblFactRutas"), data);
		if (this.isTaxiJustifi(data)) // descripcion del itinerario del taxi
			return data.desc;
		if (this.isTicket(data))
			return i18n.getItem("tipoTickets", data.subtipo) || "-";
		return this.isPernocta(data) ? i18n.render(i18n.get("lblRangoNoches"), data) : data.desc;
	}

	row = (data, status, resume) => {
		this.rowCalc(data, resume);
		const link = `<a href="#adjunto" target="_blank" class="far fa-paperclip action resize" title="Ver adjunto"></a>`;
		const remove = iris.isEditable() ? `<a href="#remove"><i class="fas fa-times action text-red resize"></i></a>` : "";

		return `<tr class="tb-data tb-data-tc">
			<td data-cell="Nº">${status.count}</td>
			<td data-cell="${i18n.get("lblTipoGasto")}">${this.getDescSubtipo(data)}</td>
			<td data-cell="${i18n.get("lblDescObserv")}">${this.getDescGasto(data)}</td>
			<td data-cell="${i18n.get("lblAdjunto")}">${data.nombre}</td>
			<td data-cell="${i18n.get("lblImporte")}">${i18n.isoFloat(data.imp1) ?? "-"} €</td>
			<td data-cell="${i18n.get("lblAcciones")}" class="no-print"><span>${link}${remove}</span></td>
		</tr>`;
	}

	getTable = () => ({ msgEmptyTable: "msgGastosEmpty", beforeRender: this.beforeRender, rowCalc: this.rowCalc, onRender: this.row });
}

export default new Gasto();
