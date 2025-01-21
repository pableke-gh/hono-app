
import i18n from "../../i18n/langs.js";
import Solicitud from "./Solicitud.js";
import Partidas from "./presto/Partidas.js";

class Presto extends Solicitud {
    #partidas = new Partidas(this);

    setData(data) {
        super.setData(data); // Update data instance
        data.titulo = i18n.getItem("descTipos", data.tipo - 1);
        return this;
    }

    get partidas() { return this.#partidas; }
    getPartidas() { return this.partidas; }
    getPartida = this.partidas.getPartida;

	isTcr() { return (super.tipo == 1); }
	isFce() { return (super.tipo == 6); }
	isL83() { return (super.tipo == 3); }
	isGcr() { return (super.tipo == 4); }
	isAnt() { return (super.tipo == 5); }
	isAfc() { return (super.tipo == 8); }
	is030() { return (super.isUae() && (this.isGcr() || this.isAnt())); }

	isEjecutable() { return ((super.isUae() && super.isPendiente()) || super.isEjecutable()); }
	isIntegrable() { return (!this.isAfc() && super.isIntegrable()); }
	isImpCd() { return (this.isEditable() && !this.isAnt()); }
	getAdjunto() { return super.get("file"); }

    isPartidaDec() { return (this.isTcr() || this.isL83() || this.isAnt() || this.isAfc()); }
	isMultipartida() { return (this.isTcr() || this.isFce() || this.isGcr()); }
	showPartidasInc() { return (this.isMultipartida() && this.isEditable() && (this.partidas.size() < 20)); }
	isPartidaExt() { return (this.isGcr() || this.isAnt()); }
	isDisableEjInc() { return (this.isDisabled() || this.isTcr() /*|| this.isFce()*/); }
	isAutoLoadImp() { return (this.isL83() || this.isAnt() || this.isAfc()); }
	isAutoLoadInc() { return (this.isL83() || this.isAnt()); }
	hasMultipartida() { return (super.mask & 1); }
	isAnticipada() { return (super.mask & 4); }
	isExcedida() { return (super.mask & 8); }
	getMemo() { return super.get("memo"); }

	row(data) {
        const self = Presto.self(); // current instance
        const otras = self.setData(data).hasMultipartida() ? "<span> (y otras)</span>" : "";

        let info = '<td></td>';
        if (self.isUrgente())
            info = `<td class="text-center text-red text-xl" title="${data.name}: ${data.extra}">&#33;</td>`;
        if ((self.isUae() || self.isOtri()) && self.isAnticipada())
            info = '<td class="text-center text-xl" title="Este contrato ha gozado de anticipo en algún momento">&#65;</td>';
        if ((self.isUae() || self.isOtri()) && self.isExcedida())
            info = '<td class="text-center text-warn text-xl" title="La cantidad solicitada excede el margen registrado por el Buzón de Ingresos">&#9888;</td>';

        let acciones = '<a href="#rcView" class="row-action"><i class="fas fa-search action resize text-blue"></i></a>';
        if (self.isFirmable())
            acciones += `<a href="#rcFirmar" class="row-action resize firma-${data.id}" data-confirm="msgFirmar"><i class="fas fa-check action resize text-green"></i></a>
                         <a href="#tab-11" class="row-action resize firma-${data.id}"><i class="fas fa-times action resize text-red"></i></a>`;
        if (!self.isEditable())
            acciones += '<a href="#rcReport" class="row-action"><i class="fal fa-file-pdf action resize text-red"></i></a>';
        if (self.isIntegrable())
            acciones += '<a href="#rcIntegrar" class="row-action" data-confirm="msgIntegrar"><i class="far fa-save action resize text-blue"></i></a>';
        if (self.isEjecutable())
            acciones += '<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action resize text-green"></i></a>';
        if (self.isAdmin())
            acciones += '<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action resize text-red"></i></a>';

        return `<tr class="tb-data">
            ${info}
            <td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
            <td class="hide-sm">${data.titulo}</td>
            <td class="${self.getStyleByEstado(data)} estado-${data.id}">${self.getDescEstado()}</td>
            <td class="text-center">${self.getFirma().myFlag(data.fmask, data.info)}</td>
            <td class="hide-sm">${data.sig || ""}</td>
            <td title="${data.oIncDesc}">${data.orgInc}${otras}</td>
            <td class="text-center" title="${data.eIncDesc}">${data.ecoInc}</td>
            <td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
            <td class="hide-sm">${data.name}</td>
            <td class="hide-md">${data.memo}</td>
            <td class="text-right no-print">${acciones}</td>
        </tr>`;
    }
	tfoot(resume) { return `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`; }

	validate(data) {
        const self = Presto.self();
        const valid = i18n.getValidators();
        valid.isKey("acOrgDec", data.idOrgDec, "Debe seleccionar la orgánica que disminuye"); // autocomplete required key
        valid.isKey("idEcoDec", data.idEcoDec, "Debe seleccionar la económica que disminuye"); // select required number

        const imp = data.impDec ?? 0; // los importes pueden ser nulos segun el tipo de presto
        const cd = self.isAnt() ? imp : (data.cd ?? 0); // los anticipos no validan el CD
        if (imp > cd)
            valid.addError("impDec", "errExceeded", "El importe de la partida que disminuye supera el crédito disponible");
        if (self.isPartidaDec() && (self.partidas.getImporte() != imp)) // Valido los importes a decrementar e incrementar
            valid.addError("impDec", "notValid", "¡Los importes a decrementar e incrementar no coinciden!");
        valid.size("memo", data.memo, "Debe asociar una memoria justificativa a la solicitud."); // Required string
        if (data.urgente == "2") { // Solicitud urgente
            valid.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta solicitud."); // Required string
            valid.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta solicitud."); // Required date
        }
        return valid.isOk() && self.partidas.validate();
    }
}

export default new Presto();
