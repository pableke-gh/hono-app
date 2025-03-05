
import sb from "../../../components/types/StringBox.js";
import tb from "../../../components/types/TemporalBox.js";
import i18n from "../../../i18n/langs.js";
import rr from "./RutaRender.js";

function Ruta() {
	const self = this; //self instance
	//const MIN_DATE = tb.now().add({ years: -1 }); //1 año antes
	//const MAX_DATE = tb.now().add({ days: 180 }); //6 meses despues 

	this.salida = ruta => tb.parse(ruta.dt1);
	this.llegada = ruta => tb.parse(ruta.dt2);

	this.isPrincipal = rr.isPrincipal;
	this.setPrincipal = rr.setPrincipal;
	this.setOrdinaria = rr.setOrdinaria;

	this.isVehiculoPropio = rr.isVehiculoPropio;
	this.isVehiculoAlquiler = rr.isVehiculoAlquiler;
	this.isVehiculoAjeno = rr.isVehiculoAjeno;
	this.isTaxiInterurbano = rr.isTaxiInterurbano;
	this.isAsociableGasto = rr.isAsociableGasto;

	this.isSalidaTemprana = ruta => (sb.getHours(ruta.dt1) < 14);
	this.isSalidaTardia = ruta => (sb.getHours(ruta.dt1) > 21);
	this.isLlegadaTemprana = ruta => (sb.getHours(ruta.dt2) < 14);
	this.isLlegadaTardia = ruta => (sb.getHours(ruta.dt2) < 5);
	this.isLlegadaCena = ruta => (sb.getHours(ruta.dt2) > 21);

	this.getOrigen = ruta => ruta.origen;
	this.getPaisSalida = ruta => ruta.pais1;
	this.getPaisllegada = ruta => ruta.pais2;
	this.getPaisPernocta = ruta => {
		return self.isLlegadaTardia(ruta) ? self.getPaisllegada(ruta) : self.getPaisSalida(ruta);
	}

	this.getImpKm = rr.getImpKm;
	this.substractKm = (resume, ruta) => {
		resume.totKm -= ruta.km1;
		resume.impKm -= rr.getImpKm(ruta);
		return self;
	}
	this.addKm = (resume, ruta) => {
		resume.totKm += ruta.km1;
		resume.impKm += rr.getImpKm(ruta);
		return self;
	}
	this.recalcKm = (resume, ruta, km) => { 
		self.substractKm(resume, ruta, km);
		ruta.km1 = km;
		return self.addKm(resume, ruta);
	}

	this.link = (ruta, id) => { ruta.g = id; return self; }
	this.unlink = ruta => { delete ruta.g; return self; }

	this.valid = (ruta) => {
		const valid = i18n.getValidators(); //i18n.getValidation();
		if (!ruta.origen || !ruta.pais1)
			valid.addRequired("origen", "errOrigen");
		// OJO! descomentar validacion matricula y fechas
		//if (self.isVehiculoPropio(ruta) && !window.IRSE.matricula)
			//valid.addRequired("matricula", "errMatricula");
		//if (!tb.isBetween(self.salida(ruta), MIN_DATE, MAX_DATE)) 
			//return valid.addError("f1", "errFechasRuta").isOk();
		if (ruta.dt1 > ruta.dt2)
			return valid.addError("f1", "errFechasOrden").isOk();
		return valid.isOk();
	}
	this.validRutas = (r1, r2) => {
		if (!self.valid(r2))
			return false; //stop
		const valid = i18n.getValidation();
		if (!r1.pais2.startsWith(r2.pais1.substring(0, 2)))
			return valid.addError("destino", "errItinerarioPaises").isOk();
		if (r1.dt2 > r2.dt1) //rutas ordenadas
			valid.addError("destino", "errItinerarioFechas");
		return valid.isOk();
	}

	// tipos de visualizacion
	this.beforeRender = rr.beforeRender;
	this.row = rr.row;
    this.tfoot = rr.tfoot;
	this.rowReadOnly = rr.rowReadOnly;
	this.rowRutasGasto = rr.rowRutasGasto;
    this.tfootRutasGasto = rr.tfootRutasGasto;
	this.rowVehiculoPropio = rr.rowVehiculoPropio;
    this.tfootVehiculoPropio = rr.tfootVehiculoPropio;
	this.afterRender = rr.afterRender;
}

export default new Ruta();
