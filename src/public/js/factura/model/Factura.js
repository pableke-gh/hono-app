
import i18n from "../../i18n/langs.js";
import solicitud from "../../xeco/model/Solicitud.js";
import firma from "../../xeco/model/Firma.js";
import lineas from "./Lineas.js";

const TITULOS = [ "-", "factura", "abono", "carta de pago", "factura de TTPP", "factura de congreso" ];

function Factura() {
	const self = this; //self instance

	this.getData = solicitud.getData;
	this.isUae = solicitud.isUae;
	this.isEditable = solicitud.isEditable;
	this.isDisabled = solicitud.isDisabled;
	this.isEditableUae = solicitud.isEditableUae;
	this.getSubtipo = solicitud.getSubtipo;
	this.setSubtipo = solicitud.setSubtipo;
	this.getCodigo = solicitud.getCodigo;
	this.getTitulo = tipo => TITULOS[tipo] || TITULOS[1];

	this.getLineas = () => lineas;
	this.setLineas = table => { lineas.setData(table.getData()); return self; }
	this.getLinea = lineas.getLinea;

	this.isFactura = () => (solicitud.getTipo() == 1);
    //this.isAbono = () => (solicitud.getTipo() == 2);
	this.isCartaPago = () => (solicitud.getTipo() == 3);
	this.isReciboCV = () => (solicitud.getTipo() == 4); // viene de CV
	this.isCongresoCV = () => (solicitud.getTipo() == 5); // viene de CV
	this.isFacturable = () => (self.isFactura() || self.isReciboCV() || self.isCongresoCV());
	this.isFirmaGaca = () => (self.isReciboCV() && self.isTtpp() && (solicitud.getMask() & 2));

	this.isTtpp = () => (solicitud.getSubtipo() == 3);
	this.isTituloOficial = () => (solicitud.getSubtipo() == 4);
	this.isExtension = () => (solicitud.getSubtipo() == 9);
	this.isDeportes = () => (solicitud.getSubtipo() == 10);
	this.isCongresoGdi = () => (solicitud.getSubtipo() == 24);
	this.isRecibo = () => (self.isTtpp() || self.isTituloOficial() || self.isExtension() || self.isCongresoGdi());
	this.setSujeto = val => { solicitud.set("sujeto", val); return self; }
	this.isExento = () => !solicitud.get("sujeto");

	this.getIva = () => solicitud.get("iva");
	this.setIva = imp => { solicitud.set("iva", imp ?? 0); return self; }

	this.isFace = () => (solicitud.get("face") == 1); //factura electronica FACe
	this.isPlataforma = () => (solicitud.get("face") == 2); //factura electronica Otras
	this.setFace = val => { solicitud.set("face", val); return self; } // update plataforma

	this.row = data => {
		const acciones = solicitud.rowActions(data);
		const titulo = self.getTitulo(data.tipo);
		return `<tr class="tb-data">
			<td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
			<td class="hide-sm text-upper1">${titulo}</td>
			<td class="${solicitud.getStyleByEstado()} estado-${data.id}">${solicitud.getDescEstado()}</td>
			<td class="text-center">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="text-right">${i18n.isoFloat(data.imp)} €</td>
			<td>${data.nif}</td><td class="hide-xs">${data.tercero}</td>
			<td>${data.org}</td><td class="hide-sm">${data.descOrg}</td>
			<td class="hide-sm">${data.name}</td>
			<td class="text-right no-print">${acciones}</td>
		</tr>`;
	}
	this.tfoot = resume => `<tr><td colspan="99">Solicitudes: ${resume.size}</td></tr>`;
	solicitud.row = this.row;
	solicitud.tfoot = this.tfoot;

	this.validate = data => { 
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
		return valid.isOk() && lineas.validate();
	}
}

export default new Factura();
