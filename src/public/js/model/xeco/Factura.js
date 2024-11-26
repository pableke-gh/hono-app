
import i18n from "../../i18n/langs.js";
import Solicitud from "./Solicitud.js";
import Lineas from "./factura/Lineas.js";

const titulos = [ "-", "Factura", "Abono", "Carta de Pago", "Recibo de Alumno" ];

class Factura extends Solicitud {
    #lineas = new Lineas(this);

	setData(data) {
        super.setData(data);
        data.titulo = titulos[data.tipo] || titulos[1]; // default factura
        return this.setIva(data.iva);
    }

	get lineas() { return this.#lineas; }
	getLineas() { return this.lineas; }
	setLineas(table) { this.lineas.setData(table.getData()); return this; }
	getLinea = this.lineas.getLinea;

	isFactura() { return (super.tipo == 1); }
    //isAbono() { return (super.tipo == 2); }
	isCartaPago() { return (super.tipo == 3); }
	isReciboCV() { return (super.tipo == 4); }
	isFacturable() { return (this.isFactura() || this.isReciboCV()); }
	isFirmaGaca() { return this.isReciboCV() && this.isTtpp() && (super.mask & 2); }

	isTtpp() { return (super.getSubtipo() == 3); }
	isTituloOficial() { return (super.getSubtipo() == 4); }
	isExtension() { return (super.getSubtipo() == 9); }
	isDeportes() { return (super.getSubtipo() == 10); }
	isRecibo() { return (this.isTtpp() || this.isTituloOficial() || this.isExtension()); }
	setSujeto(val) { return this.set("sujeto", val); }
	isExento() { return !super.get("sujeto"); }

	getIva() { return super.get("iva"); }
	setIva(imp) { return this.set("iva", imp ?? 0); }

	isFace() { return (this.get("face") == 1); } //factura electronica FACe
	isPlataforma() { return (this.get("face") == 2); } //factura electronica Otras
	setFace(val) { return this.set("face", val); } // update plataforma

	row(data) {
        const self = Factura.self();
        self.setData(data); // initialize 
        let acciones = '<a href="#rcView" class="row-action"><i class="fas fa-search action resize text-blue"></i></a>';
        if (self.isFirmable())
            acciones += `<a href="#rcFirmar" class="row-action resize firma-${data.id}" data-confirm="msgFirmar"><i class="fas fa-check action resize text-green"></i></a>
                         <a href="#tab-11" class="row-action resize firma-${data.id}"><i class="fas fa-times action resize text-red"></i></a>`;
        if (self.isIntegrable())
            acciones += '<a href="#rcIntegrar" class="row-action" data-confirm="msgIntegrar"><i class="far fa-save action resize text-blue"></i></a>';
        if (self.isEjecutable())
            acciones += '<a href="#rcUxxiec" class="row-action"><i class="fal fa-cog action resize text-green"></i></a>';
        if (self.isAdmin())
            acciones += '<a href="#rcEmails" class="row-action"><i class="fal fa-mail-bulk action resize text-blue"></i></a><a href="#rcRemove" class="row-action" data-confirm="msgRemove"><i class="fal fa-trash-alt action resize text-red"></i></a>';

        return `<tr class="tb-data">
            <td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
            <td class="hide-sm">${data.titulo}</td>
            <td class="${self.getStyleByEstado()} estado-${data.id}">${self.getDescEstado()}</td>
            <td class="text-center">${self.getFirma().myFlag(data.fmask, data.info)}</td>
            <td class="hide-sm">${data.sig || ""}</td>
            <td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
            <td class="text-right">${i18n.isoFloat(data.imp)} €</td>
            <td>${data.nif}</td><td class="hide-xs">${data.tercero}</td>
            <td>${data.org}</td><td class="hide-sm">${data.descOrg}</td>
            <td class="hide-sm">${data.name}</td>
            <td class="text-right no-print">${acciones}</td>
        </tr>`;
    }
	tfoot(resume) { return `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`; }

	validate(data) {
        const self = Factura.self();
        const valid = i18n.getValidators();
        valid.isKey("acTercero", data.idTercero, "Debe seleccionar un tercero válido"); // autocomplete required key
        valid.isKey("delegacion", data.idDelegacion, "Debe seleccionar una delegación del tercero"); // desplegable de las delegaciones
        valid.isKey("acOrganica", data.idOrganica, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
		if (self.isRecibo()) //subtipo = ttpp o extension
            valid.size("acRecibo", data.acRecibo, "Debe indicar un número de recibo válido");
		/*if (self.isDeportes()) {
            valid.size("extra", data.extra, "errRequired", "Debe indicar un número de recibo válido"); // Required string
            valid.leToday("fMax", data.fMax, "Debe indicar la fecha del recibo asociado"); // Required date
        }*/
        //valid.size("memo", data.memo, "Debe indicar las observaciones asociadas a la solicitud."); // Required string
        if (self.isFace())
            valid.size("og", data.og) && valid.size("oc", data.oc) && valid.size("ut", data.ut);
        if (self.isPlataforma())
            valid.size("og", data.og);
        return valid.isOk() && self.lineas.validate();
    }
}

export default new Factura();
