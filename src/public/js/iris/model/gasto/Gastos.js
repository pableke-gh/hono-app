
import gasto from "./Gasto.js";

function Gastos() {
	const self = this; //self instance
	let _gastos = []; // dietas, pernoctas, transporte, etc...
	let _gKm, _gSubv, _gCongreso, _gAc, _gIban, _gBanco; // singles gastos

	this.getGastos = () => _gastos;
	this.getFacturas = () => _gastos.filter(gasto.isFactura);
	this.getTickets = () => _gastos.filter(gasto.isTicket);
	this.getTransporte = () => _gastos.filter(gasto.isTransporte);
	this.getPernoctas = () => _gastos.filter(gasto.isPernocta);
	this.getDietas = () => _gastos.filter(gasto.isDieta);
	this.getPaso5 = () => _gastos.filter(gasto.isPaso5);
	this.getKm = () => _gastos.find(gasto.isKm);
	this.getSubvencion = () => _gastos.find(gasto.isSubvencion);
	this.getCongreso = () => _gastos.find(gasto.isCongreso);
	this.getAsistencia = () => _gastos.find(gasto.isAsistencia);
	this.getIban = () => _gastos.find(gasto.isIban);
	this.getBanco = () => _gastos.find(gasto.isBanco);
	this.getDocumentacion = () => _gastos.filter(gasto.isDoc);
	this.getGastosComisionado = () => _gastos.filter(gasto.isDocComisionado);
	this.getGastosDocumentacion = () => _gastos.filter(gasto.isOtraDoc);
	this.getOrganicas = () => _gastos.filter(gasto.isOrganica);
	this.getOrganicaDieta = () => _gastos.find(gasto.isOrganicaDieta);
	this.getOrganicaPernocta = () => _gastos.find(gasto.isOrganicaPernocta);
	this.getOrganicaTrans = () => _gastos.find(gasto.isOrganicaTrans);
	this.getOrganicaAc = () => _gastos.find(gasto.isOrganicaAc);
	this.setGastos = gastos => {
		_gastos = gastos;
		_gKm = self.getKm();
		_gSubv = self.getSubvencion();
		_gCongreso = self.getCongreso();
		_gAc = self.getAsistencia();
		_gIban = self.getIban();
		_gBanco = self.getBanco();
	}

	this.getMatricula = () => gasto.getMatricula(_gKm);
	this.getJustifiKm = () => gasto.getJustifiKm(_gKm);
	this.setKm = (data, resumen) => { gasto.setKm(_gKm, data, resumen); return self; }

	this.getTipoSubv = () => gasto.getTipoSubv(_gSubv); // _gSubv = tipo subv. = estado
	this.getFinalidad = () => gasto.getFinalidad(_gSubv); // _gSubv = finalidad = subtipo
	this.getVinc = () => gasto.getVinc(_gSubv); // _gSubv = vinculacion al proyecto = num
	this.getJustifi = () => gasto.getJustifi(_gSubv); // _gSubv = justificacion = desc
	this.setSubvencion = data => { gasto.setSubvencion(_gSubv, data); return self; }

	this.getTipoCongreso = () => gasto.getTipoCongreso(_gCongreso);
	this.getImpInsc = () => gasto.getImpInsc(_gCongreso);
	this.getF1Cong = () => gasto.getF1Cong(_gCongreso);
	this.getF2Cong = () => gasto.getF2Cong(_gCongreso);
	this.getJustifiCong = () => gasto.getJustifiCong(_gCongreso);
	this.setCongreso = data => { gasto.setCongreso(_gCongreso, data); return self; }

	this.getImpAc = () => gasto.getImpAc(_gAc);
	this.getJustifiVp = () => gasto.getJustifiVp(_gAc);
	this.setAsistencia = data => { gasto.setAsistencia(_gAc, data); return self; }

	this.getGrupoDieta = () => gasto.getGrupoDieta(_gIban);
	this.getTipoDieta = () => gasto.getTipoDieta(_gIban);
	this.setTipoDieta = tipo => gasto.setTipoDieta(_gIban, tipo);
	this.getCodigoIban = () => gasto.getCodigoIban(_gIban);
	this.getSwift = () => gasto.getSwift(_gIban);
	this.getObservaciones = () => gasto.getObservaciones(_gIban);
	this.setIban = data => { gasto.setIban(_gIban, data); return self; }

	this.getNombreEntidad = () => gasto.getNombreEntidad(_gBanco);
	this.getPaisEntidad = () => gasto.getPaisEntidad(_gBanco);
	this.getCodigoEntidad = () => gasto.getCodigoEntidad(_gBanco);
	this.setBanco = data => { gasto.setBanco(_gBanco, data); return self; }

	this.getNumPernoctas = () => _gastos.reduce((num, row) => (num + (gasto.isPernocta(row) ? row.num : 0)), 0);
	this.filter = fn => { _gastos = _gastos.filter(fn); return self; }
	this.removeById = data => self.filter(gasto => (gasto.id != data.id));
	this.removeByTipo = data => self.filter(gasto => (gasto.tipo != data.tipo));
	this.push = data => { _gastos.push(data); return self; }
}

export default new Gastos();
