
import sb from "../../components/StringBox.js";
import tb from "../../components/TemporalBox.js";
import i18n from "../../i18n/langs.js";

function Ruta() {
	const self = this; //self instance
	//const MIN_DATE = tb.now().add({ years: -1 }); //1 año antes
	//const MAX_DATE = tb.now().add({ days: 180 }); //6 meses despues 
	const principal = ' <span class="text-warn icon"> <i class="fal fa-flag-checkered"></i></span>';

	this.salida = ruta => tb.parse(ruta.dt1);
	this.llegada = ruta => tb.parse(ruta.dt2);

	this.isPrincipal = ruta => ((ruta.mask & 1) == 1);
	this.setPrincipal = ruta => { ruta.mask |= 1; return self; }
	this.setOrdinaria = ruta => { ruta.mask &= ~1; return self; }

	this.isVehiculoPropio = ruta => (ruta.desp == 1);
	this.isVehiculoAlquiler = ruta => (ruta.desp == 2);
	this.isVehiculoAjeno = ruta => (ruta.desp == 3);
	this.isTaxiInterurbano = ruta => (ruta.desp == 4);
	this.isAsociableGasto = ruta => (!self.isVehiculoPropio(ruta) && !self.isVehiculoAjeno(ruta)); //rutas a las que se le puede asignar un gasto

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

	this.link = (ruta, id) => { ruta.g = id; return self; }
	this.unlink = ruta => { delete ruta.g; return self; }

	this.valid = (ruta) => {
		const valid = i18n.getValidators(); //i18n.getValidation();
		if (!ruta.origen || !ruta.pais1)
			valid.addRequired("origen", "errOrigen");
		if (self.isVehiculoPropio(ruta) && !window.IRSE.matricula)
			valid.addRequired("matricula", "errMatricula");
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
	function fnAccumulate(ruta, resume) {
		resume.totKm += self.isVehiculoPropio(ruta) ? ruta.km1 : 0;
		resume.totKmCalc += self.isVehiculoPropio(ruta) ? ruta.km2 : 0;
	}
	this.beforeRender = resume => {
		resume.impKm = resume.totKm = resume.totKmCalc = 0;
	}
	this.row = (ruta, status, resume) => {
		fnAccumulate(ruta, resume);
		const editable = window.IRSE.editable;
		const flag = self.isPrincipal(ruta) ? principal : "";
		const destino = editable ? `<a href="#main" class="row-action">${ruta.destino}${flag}</a>` : `${ruta.destino}${flag}`;
		const remove = editable ? '<a href="#remove" class="row-action"><i class="fas fa-times action text-red resize"></i></a>' : ""; // #{iris.form.editableP0}
		return `<tr class="tb-data tb-data-tc">
			<td class="hide-sm" data-cell="Nº">${status.count}</td>
			<td data-cell="Origen">${ruta.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(ruta.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(ruta.dt1)}</td>
			<td data-cell="Destino">${destino}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", ruta.desp)}</td>
			<td class="hide-sm" data-cell="Km.">${i18n.isoFloat(ruta.km2) || "-"}</td>
			<td class="no-print" data-cell="Acciones">${remove}</td>
		</tr>`;
	}
	this.rowReadOnly = (ruta, status, resume) => {
		fnAccumulate(ruta, resume);
		const flag = self.isPrincipal(ruta) ? principal : "";
		return `<tr class="tb-data tb-data-tc">
			<td class="hide-sm" data-cell="Nº">${status.count}</td>
			<td data-cell="Origen">${ruta.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(ruta.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(ruta.dt1)}</td>
			<td data-cell="Destino">${ruta.destino}${flag}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", ruta.desp)}</td>
			<td class="hide-sm" data-cell="Km.">${i18n.isoFloat(ruta.km2) || "-"}</td>
		</tr>`;
	}
    this.tfoot = resume => {
		const totKmCalc = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";
		return `<tr>
			<td colspan="8">Etapas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs hide-sm">${totKmCalc}</td>
			<td class="hide-sm no-print"></td>
		</tr>`;
	}
	this.rowRutasGasto = (ruta, status, resume) => {
		fnAccumulate(ruta, resume);
		const flag = self.isPrincipal(ruta) ? principal : "";
		return `<tr class="tb-data tb-data-tc">
			<td class="hide-sm" data-cell="Nº">${status.count}</td>
			<td data-cell="Origen">${ruta.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(ruta.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(ruta.dt1)}</td>
			<td data-cell="Destino">${ruta.destino}${flag}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", ruta.desp)}</td>
			<td data-cell="Asociar Etapa"><input type="checkbox" value="${ruta.id}" class="link-ruta" /></td>
		</tr>`;
	}
    this.tfootRutasGasto = resume => {
		return `<tr><td colspan="99">Etapas: ${resume.size}</td></tr>`;
	}
	this.rowVehiculoPropio = (ruta, status, resume) => {
		fnAccumulate(ruta, resume);
		const impKm = ruta.km1 * window.IRSE.gasolina;
		resume.impKm += impKm;
		const km1 = i18n.isoFloat(ruta.km1);
		const editable = window.IRSE.editable;
		const cell = editable ? `<input type="text" value="${km1}" tabindex="100" class="ui-float tc"/>` : km1;
		return `<tr class="tb-data tb-data-tc">
			<td data-cell="#{msg['lbl.origen.etapa']}">${ruta.origen}</td>
			<td data-cell="#{msg['lbl.fecha.salida']}">${i18n.isoDate(ruta.dt1)}</td>
			<td data-cell="#{msg['lbl.hora.salida']}">${i18n.isoTimeShort(ruta.dt1)}</td>
			<td data-cell="#{msg['lbl.destino.etapa']}">${ruta.destino}</td>
			<td data-cell="#{msg['lbl.fecha.llegada']}">${i18n.isoDate(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.hora.llegada']}">${i18n.isoTimeShort(ruta.dt2)}</td>
			<td data-cell="#{msg['lbl.medio.trans']}">${i18n.getItem("tiposDesp", ruta.desp)}</td>
			<td data-cell="Google km">${i18n.isoFloat(ruta.km2) || "-"}</td>
			<td data-cell="#{msg['lbl.tus.km']}">${cell}</td>
			<td data-cell="#{msg['lbl.importe']}">${impKm} €</td>
		</tr>`;
	}
    this.tfootVehiculoPropio = resume => {
		return `<tr>
			<td colspan="8">Etapas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.totKmCalc)}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.totKm)}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.impKm)} €</td>
		</tr>`;
	}
	this.afterRender = resume => {
		//resume.km1 = resume.totKm; //synonym
		resume.impKm = resume.totKm * window.IRSE.gasolina;
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;
	}
}

export default new Ruta();
