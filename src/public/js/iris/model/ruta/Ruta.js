
import sb from "../../../components/types/StringBox.js";
import tb from "../../../components/types/TemporalBox.js";
import i18n from "../../i18n/langs.js";
import paises from "../../data/paises/paises.js";

function Ruta() {
	const self = this; //self instance
	const GASOLINA = .26; // € / kilometro
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
		ruta.tplFlag = `<span class="text-warn icon table-refresh" data-refresh="text-render" data-template="@flag;">${TPL_FLAG}</span>`;
		return self;
	}
	const setTplOrdinaria = ruta => {
		delete ruta.flag;
		ruta.spanFlag = "";
		ruta.tplFlag = '<span class="text-warn icon table-refresh" data-refresh="text-render" data-template="@flag;"></span>';
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
	this.isDespSinFactura = ruta => (self.isVehiculoPropio(ruta) || self.isVehiculoAjeno(ruta));
	this.isDespConFactura = ruta => !self.isDespSinFactura(ruta); // desplazamiento que requiere factura
	this.isUnlinked = ruta => (self.isLinkable(ruta) && !ruta.g); // rutas asociables a gasto sin gasto asociado
	this.isLinkable = self.isDespConFactura; // rutas a las que se le puede asignar un gasto 

	this.getImpGasolina = () => GASOLINA;
	this.getImpKm = ruta => (ruta.km1 * GASOLINA);

	this.isSalidaTemprana = ruta => (sb.getHours(ruta.dt1) < 14);
	this.isSalidaTardia = ruta => (sb.getHours(ruta.dt1) > 21);
	this.isLlegadaTemprana = ruta => (sb.getHours(ruta.dt2) < 14);
	this.isLlegadaTardia = ruta => (sb.getHours(ruta.dt2) < 5);
	this.isLlegadaCena = ruta => (sb.getHours(ruta.dt2) > 21);

	this.getOrigen = ruta => ruta.origen;
	this.getPaisSalida = ruta => ruta.pais1;
	this.getDestino = ruta => ruta.destino;
	this.getPaisllegada = ruta => ruta.pais2;
	this.getPaisDestino = ruta => paises.getPais(ruta.pais2);
	this.getMedioTransporte = ruta => i18n.getItem("tiposDesp", ruta.desp);
	this.getTrayecto = ruta => (ruta.origen + " - " + ruta.destino);
	this.getTrayectoPais = ruta => `${ruta.origen} (${ruta.pais1}) - ${ruta.destino} (${ruta.pais2})`;
	this.getPaisPernocta = ruta => (self.isLlegadaTardia(ruta) ? self.getPaisllegada(ruta) : self.getPaisSalida(ruta));

	this.valid = ruta => {
		const valid = i18n.getValidation();
		if (!ruta.origen || !ruta.pais1)
			valid.addRequired("origen", "errOrigen");
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
		resume.vp = resume.unlinked = 0;
		resume.impKm = resume.totKm = resume.totKmCalc = 0;
	}
	this.rowCalc = (data, resume) => {
		if (self.isPrincipal(data))
			setTplPrincipal(data);
		else
			setTplOrdinaria(data);
		if (self.isVehiculoPropio(data)) {
			resume.vp++;
			resume.totKm += data.km1;
			resume.totKmCalc += data.km2;
		}
		resume.unlinked += self.isUnlinked(data);
	}
}

export default new Ruta();
