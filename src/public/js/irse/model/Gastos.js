
import gasto from "./Gasto.js";

function Gastos() {
	const self = this; //self instance
	let _gastos = []; // dietas, pernoctas, transporte, etc... (gastos variables)
	let _km, _congreso, _subv, _ac, _iban, _banco; // gasto fijos de la solicitud

	this.getGastos = () => _gastos; // contenedor de gastos actual
	this.setGastos = gastos => { _gastos = gastos || []; return self; } // puede no haber gastos asociados
	this.getFacturas = () => _gastos.filter(gasto.isFactura);
	this.getTickets = () => _gastos.filter(gasto.isTicket);
	this.getTransporte = () => _gastos.filter(gasto.isTransporte);
	this.getPernoctas = () => _gastos.filter(gasto.isPernocta);
	this.getDietas = () => _gastos.filter(gasto.isDieta);
	this.getPaso5 = () => _gastos.filter(gasto.isPaso5);
	this.getExtra = () => _gastos.filter(gasto.isExtra);
	this.getSubvencion = () => _gastos.find(gasto.isSubvencion);
	this.getCongreso = () => _gastos.find(gasto.isCongreso);
	this.getAsistencia = () => _gastos.find(gasto.isAsistencia);
	this.getDocumentacion = () => _gastos.filter(gasto.isDoc);
	this.getGastosComisionado = () => _gastos.filter(gasto.isDocComisionado);
	this.getGastosDocumentacion = () => _gastos.filter(gasto.isOtraDoc);
	this.getOrganicas = () => _gastos.filter(gasto.isOrganica);
	this.getOrganicaDieta = () => _gastos.find(gasto.isOrganicaDieta);
	this.getOrganicaPernocta = () => _gastos.find(gasto.isOrganicaPernocta);
	this.getOrganicaTrans = () => _gastos.find(gasto.isOrganicaTrans);
	this.getOrganicaAc = () => _gastos.find(gasto.isOrganicaAc);

	this.getKm = () => _km; // gasto de tipo km
	this.setKm = km => { _km = km; return self; }
	this.getJustifiKm = () => _km.desc;

	this.getSubv = () => _subv; // gasto de tipo subvencion paso 3
	this.setSubv = subv => { _subv = subv; return self; }
	this.getTipoSubv = () => _subv.estado; // tipo de subvencion = [1 .. 5]
	this.getFinalidad = () => _subv.subtipo; // finalidad = subtipo [1 .. 3]
	this.getVinc = () => _subv.num; // vinculación con el prouecto [1 .. 5]
	this.getJustifi = () => _subv.desc; // justiicacion ISU

	this.getAc = () => _ac; // asistencia / colaboracion teorico paso 4
	this.setAc = ac => { _ac = ac; return self; }
	this.getJustifiVp = () => _ac.desc; // justifiVp del paso 3

	this.getCongreso = () => _congreso; // gasto de tipo congreso paso 3
	this.setCongreso = congreso => { _congreso = congreso; return self; }
	this.getEstadoCongreso = () => _congreso.estado; // default = 0 = No
	this.isCongreso = () => (_congreso.estado == 4); // congreso = No / Si
	this.getImpInsc = () => _congreso.imp1; // importe del congreso
	this.getF1Congreso = () => _congreso.f1; // fecha inicio del congreso
	this.getF2Congreso = () => _congreso.f2; // fecha fin del congreso
	this.getJustifiCong = () => _congreso.desc; // justificación

	this.getIban = () => _iban; // gasto de tipo iban paso 9
	this.setIban = iban => { _iban = iban; return self; }
	this.getGrupoDieta = () => _iban.subtipo; // default = grupo 2
	this.getTipoDieta = () => _iban.estado; // tipo de dieta = estado (RD = 1, EUT = 2, UPCT = 9)
	this.getImpGasolina = () => _iban.imp1; // importe € / km
	this.getIrpf = () => _iban.imp2; // porcentaje de irpf (ej: 15 %)
	this.getCodigoIban = () => _iban.nombre;
	this.getSwift = () => _iban.cod; // para cuentas extranjeras
	this.getObservaciones = () => _iban.desc;

	this.getBanco = () => _banco; // gasto de tipo banco paso 9
	this.setBanco = banco => { _banco = banco; return self; }
	this.getPaisEntidad = () => _banco.cod; // ES, GB, IT, FR, etc ...
	this.getCodigoEntidad = () => _banco.nombre; // 2100 = caixabank
	this.getNombreEntidad = () => _banco.desc; // BBVA, Santander. etc ...

	//this.getNumPernoctas = () => _gastos.reduce((num, row) => (num + (gasto.isPernocta(row) ? row.num : 0)), 0);
	this.filter = fn => { _gastos = _gastos.filter(fn); return self; }
	this.removeById = id => self.filter(gasto => (gasto.id != id));
	this.removeByTipo = tipo => self.filter(gasto => (gasto.tipo != tipo));
	this.push = data => { _gastos.push(data); return self; }
}

export default new Gastos();
