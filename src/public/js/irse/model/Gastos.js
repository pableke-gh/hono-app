
import gasto from "./Gasto.js";

function Gastos() {
	const self = this; //self instance
	let _gastos = []; // dietas, pernoctas, transporte, etc...

	this.getGastos = () => _gastos;
	this.setGastos = gastos => { _gastos = gastos; }
	this.getFacturas = () => _gastos.filter(gasto.isFactura);
	this.getTickets = () => _gastos.filter(gasto.isTicket);
	this.getTransporte = () => _gastos.filter(gasto.isTransporte);
	this.getPernoctas = () => _gastos.filter(gasto.isPernocta);
	this.getDietas = () => _gastos.filter(gasto.isDieta);
	this.getPaso5 = () => _gastos.filter(gasto.isPaso5);
	this.getExtra = () => _gastos.filter(gasto.isExtra);
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

	//this.getNumPernoctas = () => _gastos.reduce((num, row) => (num + (gasto.isPernocta(row) ? row.num : 0)), 0);
	this.filter = fn => { _gastos = _gastos.filter(fn); return self; }
	this.removeById = id => self.filter(gasto => (gasto.id != id));
	this.removeByTipo = tipo => self.filter(gasto => (gasto.tipo != tipo));
	this.push = data => { _gastos.push(data); return self; }
}

export default new Gastos();
