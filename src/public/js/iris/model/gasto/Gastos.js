
import gasto from "./Gasto.js";

function Gastos() {
	const self = this; //self instance
	let _gastos = []; // dietas, pernoctas, transporte, etc...

	this.getGastos = () => _gastos;
	this.getFacturas = () => _gastos.filter(gasto.isFactura);
	this.getTickets = () => _gastos.filter(gasto.isTicket);
	this.getTransporte = () => _gastos.filter(gasto.isTransporte);
	this.getPernoctas = () => _gastos.filter(gasto.isPernocta);
	this.getDietas = () => _gastos.filter(gasto.isDieta);
	this.getPaso5 = () => _gastos.filter(gasto.isPaso5);
	this.getKm = () => _gastos.find(gasto.isKm);
	this.setGastos = gastos => { _gastos = gastos; }

	const fnUpdateGastos = (data, fn) => { _gastos = _gastos.filter(fn).concat(data); return self; }
	this.updatePaso5 = data => fnUpdateGastos(data, gasto.isPaso5);
	this.updateTransporte = data => fnUpdateGastos(data, gasto.isTransporte);
	this.updateDietas = data => fnUpdateGastos(data, gasto.isDieta);

	this.getMatricula = () => gasto.getMatricula(self.getKm());

	this.getNumPernoctas = () => _gastos.reduce((num, row) => (num + (gasto.isPernocta(row) ? row.num : 0)), 0);
	this.push = data => { _gastos.push(data); return self; }
	this.remove = data => { _gastos = _gastos.filter(gasto => (gasto.id != data.id)); }
}

export default new Gastos();
