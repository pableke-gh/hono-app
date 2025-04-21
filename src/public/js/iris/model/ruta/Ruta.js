
import sb from "../../../components/types/StringBox.js";
import tb from "../../../components/types/TemporalBox.js";
import i18n from "../../../i18n/langs.js";

function Ruta() {
	const self = this; //self instance
	const TPL_FLAG = '<i class="fal fa-flag-checkered"></i>';
	//const MIN_DATE = tb.now().add({ years: -1 }); //1 año antes
	//const MAX_DATE = tb.now().add({ days: 180 }); //6 meses despues 

	this.getHoraSalida = ruta => ruta.dt1;
	this.getHoraLlegada = ruta => ruta.dt2;
	this.salida = ruta => tb.parse(self.getHoraSalida(ruta));
	this.llegada = ruta => tb.parse(self.getHoraLlegada(ruta));

	// tipos de rutas
	const setTplPrincipal = ruta => {
		ruta.flag = TPL_FLAG;
		ruta.spanFlag = `<span class="text-warn icon">${TPL_FLAG}</span>`;
		ruta.tplFlag = `<span class="text-warn icon text-render" data-template="@flag;">${TPL_FLAG}</span>`;
		return self;
	}
	const setTplOrdinaria = ruta => {
		delete ruta.flag;
		ruta.spanFlag = "";
		ruta.tplFlag = '<span class="text-warn icon text-render" data-template="@flag;"></span>';
		return self;
	}
	this.isPrincipal = ruta => ((ruta.mask & 1) == 1);
	this.setPrincipal = ruta => { ruta.mask |= 1; return setTplPrincipal(ruta); }
	this.setOrdinaria = ruta => { ruta.mask &= ~1; return setTplOrdinaria(ruta); }

	// tipos de desplazamiento
	this.isVehiculoPropio = ruta => (ruta.desp == 1);
	this.isVehiculoAlquiler = ruta => (ruta.desp == 2);
	this.isVehiculoAjeno = ruta => (ruta.desp == 3);
	this.isTaxiInterurbano = ruta => (ruta.desp == 4);
	this.isLinkable = ruta => (!self.isVehiculoPropio(ruta) && !self.isVehiculoAjeno(ruta)); // rutas a las que se le puede asignar un gasto
	this.isUnlinked = ruta => (self.isLinkable(ruta) && !ruta.g); // rutas asociables a gasto sin gasto asociado

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

	//this.getImpKm = rvp.getImpKm;
	//this.getImpGasolina = rvp.getImpGasolina;
	//this.recalcKm = rvp.recalcKm;
	//this.link = (ruta, id) => { ruta.g = id; return self; }
	//this.unlink = ruta => { delete ruta.g; return self; }

	this.valid = ruta => {
		const valid = i18n.getValidation();
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

	// table renders
	this.beforeRender = resume => {
		resume.impKm = resume.totKm = resume.totKmCalc = resume.unlinked = 0;
	}
	this.rowCalc = (data, resume) => {
		if (self.isPrincipal(data))
			setTplPrincipal(data);
		else
			setTplOrdinaria(data);
		resume.totKm += self.isVehiculoPropio(data) ? data.km1 : 0;
		resume.totKmCalc += self.isVehiculoPropio(data) ? data.km2 : 0;
		resume.unlinked += self.isUnlinked(data);
	}
}

export default new Ruta();
