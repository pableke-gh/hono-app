
import i18n from "../../i18n/langs.js";

function RutaRender() {
	const self = this; //self instance
	const GASOLINA = .26; //euros/kilometro
	const principal = ' <span class="text-warn icon"> <i class="fal fa-flag-checkered"></i></span>';

	// tipos de rutas
	this.isPrincipal = ruta => ((ruta.mask & 1) == 1);
	this.setPrincipal = ruta => { ruta.mask |= 1; return self; }
	this.setOrdinaria = ruta => { ruta.mask &= ~1; return self; }

	// tipos de desplazamiento
	this.isVehiculoPropio = ruta => (ruta.desp == 1);
	this.isVehiculoAlquiler = ruta => (ruta.desp == 2);
	this.isVehiculoAjeno = ruta => (ruta.desp == 3);
	this.isTaxiInterurbano = ruta => (ruta.desp == 4);
	this.isAsociableGasto = ruta => (!self.isVehiculoPropio(ruta) && !self.isVehiculoAjeno(ruta)); //rutas a las que se le puede asignar un gasto

	this.getImpKm = ruta => (ruta.km1 * GASOLINA);

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
    this.tfoot = resume => {
		const totKmCalc = (resume.totKmCalc > 0) ? i18n.isoFloat(resume.totKmCalc) : "-";
		return `<tr>
			<td colspan="8">Etapas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs hide-sm">${totKmCalc}</td>
			<td class="hide-sm no-print"></td>
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
		const impKm = self.getImpKm(ruta);
		resume.impKm += impKm;
		const km1 = i18n.isoFloat(ruta.km1);
		const editable = window.IRSE.editable;
		const cell = editable ? `<input type="text" name="km1" value="${km1}" tabindex="100" class="ui-float tc"/>` : km1;
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
			<td data-cell="#{msg['lbl.importe']}">${i18n.isoFloat(impKm)} €</td>
		</tr>`;
	}
    this.tfootVehiculoPropio = resume => {
		return `<tr>
			<td colspan="7">Etapas: ${resume.size}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.totKmCalc)}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.totKm)}</td>
			<td class="tb-data-tc hide-xs">${i18n.isoFloat(resume.impKm)} €</td>
		</tr>`;
	}
	this.afterRender = resume => {
		resume.impKm = resume.totKm * GASOLINA;
		resume.justifi = (resume.totKmCalc + .01) < resume.totKm;
	}
}

export default new RutaRender();
