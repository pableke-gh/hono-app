
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
}

export default new Gasto();
