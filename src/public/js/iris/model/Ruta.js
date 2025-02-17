
import sb from "../../components/StringBox.js";
import tb from "../../components/TemporalBox.js";
import i18n from "../../i18n/langs.js";

function Ruta() {
	const self = this; //self instance
	//const MIN_DATE = tb.clone().add({ days: -365 }); //1 año antes
	//const MAX_DATE = tb.clone().add({ days: 180 }); //6 meses despues 

	this.salida = ruta => tb.parse(ruta.dt1);
	this.llegada = ruta => tb.parse(ruta.dt2);

	this.isVehiculoPropio = ruta => (ruta.desp == 1);

	this.isSalidaTemprana = ruta => (sb.getHours(ruta.dt1) < 14);
	this.isSalidaTardia = ruta => (sb.getHours(ruta.dt1) > 21);
	this.isLlegadaTemprana = ruta => (sb.getHours(ruta.dt2) < 14);
	this.isLlegadaTardia = ruta => (sb.getHours(ruta.dt2) < 5);
	this.isLlegadaCena = ruta => (sb.getHours(ruta.dt2) > 21);

	this.getPaisSalida = ruta => ruta.pais1;
	this.getPaisllegada = ruta => ruta.pais2;
	this.getPaisPernocta = ruta => {
		return self.isLlegadaTardia(ruta) ? self.getPaisllegada(ruta) : self.getPaisSalida(ruta);
	}

	this.valid = ruta => {
		const valid = i18n.getValidators(); //i18n.getValidation();
		if (!ruta.origen)
			valid.addRequired("origen", "errOrigen");
		if (ruta.desp == 1)
			valid.addRequired("matricula", "errMatricula");
		if (!tb.isBetween(self.salida(ruta), MIN_DATE, MAX_DATE)) 
			return valid.addError("f1", "errFechasRuta").isOk();
		if (ruta.dt1 > ruta.dt2)
			return valid.addError("f1", "errFechasOrden").isOk();
		return valid.isOk();
	}

	this.beforRender = resume => {
		resume.totKm = resume.totKmCalc = 0;
	}
	this.row = (ruta, status, resume) => {
		const editable = window.IRSE.editable;
		const principal = '<span class="text-warn icon"> <i class="fal fa-flag-checkered"></i></span>';
		const destino = editable ? `<a href="#find">${ruta.destino} ${principal}</a>` : `${ruta.destino} ${principal}`;
		const remove = editable ? '<a href="#remove" class="row-action"><i class="fas fa-times action text-red resize"></i></a>' : ""; // #{iris.form.editableP0}
		resume.totKm += self.isVehiculoPropio(ruta) ? ruta.km1 : 0;
		resume.totKmCalc += self.isVehiculoPropio(ruta) ? ruta.km2 : 0;
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
    this.tfoot = resume => `<tr>
		<td colspan="8">Etapas: ${resume.size}</td>
		<td class="tb-data-tc hide-xs hide-sm">${i18n.isoFloat(resume.totKmCalc)}</td>
		<td class="hide-sm no-print"></td>
	</tr>`;
}

export default new Ruta();
