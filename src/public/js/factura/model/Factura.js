
import i18n from "../../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import solicitud from "../../xeco/model/Solicitud.js";
import lineas from "./Lineas.js";

const TITULOS = [ "-", "factura", "abono", "carta de pago", "factura de TTPP", "factura de congreso" ];

solicitud.getLineas = () => lineas;
solicitud.setLineas = table => { lineas.setData(table.getData()); return solicitud; }
solicitud.getLinea = lineas.getLinea;

solicitud.getTitulo = () => TITULOS[solicitud.getTipo()] || TITULOS[1];
solicitud.isFactura = () => (solicitud.getTipo() == 1);
//solicitud.isAbono = () => (solicitud.getTipo() == 2);
solicitud.isCartaPago = () => (solicitud.getTipo() == 3);
solicitud.isReciboCV = () => (solicitud.getTipo() == 4); // viene de CV
solicitud.isCongresoCV = () => (solicitud.getTipo() == 5); // viene de CV
solicitud.isFacturable = () => (solicitud.isFactura() || solicitud.isReciboCV() || solicitud.isCongresoCV());
solicitud.isFirmaGaca = () => (solicitud.isReciboCV() && solicitud.isTtpp() && (solicitud.getMask() & 2));
//solicitud.isReactivable = () => (solicitud.isUae() && (solicitud.isInvalidada() || solicitud.isErronea())); // La solicitud se puede reactivar / subsanar

solicitud.isTtpp = () => (solicitud.getSubtipo() == 3);
solicitud.isTituloOficial = () => (solicitud.getSubtipo() == 4);
solicitud.isExtension = () => (solicitud.getSubtipo() == 9);
solicitud.isDeportes = () => (solicitud.getSubtipo() == 10);
solicitud.isCongresoGdi = () => (solicitud.getSubtipo() == 24);
solicitud.isRecibo = () => (solicitud.isTtpp() || solicitud.isTituloOficial() || solicitud.isExtension() || solicitud.isCongresoGdi());
solicitud.setSujeto = val => solicitud.set("sujeto", val);
solicitud.isExento = () => !solicitud.get("sujeto");

solicitud.getIva = () => solicitud.get("iva");
solicitud.setIva = imp => solicitud.set("iva", imp ?? 0);
solicitud.getImpIva = () => 0; // importes calculados default = 0
solicitud.getImpTotal = () => 0; // importes calculados default = 0

solicitud.isFace = () => (solicitud.get("face") == 1); //factura electronica FACe
solicitud.isPlataforma = () => (solicitud.get("face") == 2); //factura electronica Otras
solicitud.setFace = val => solicitud.set("face", val); // update plataforma / FACe
solicitud.getNamePlataforma = () => (solicitud.isPlataforma() ? "Nombre de la plataforma" : "Órgano Gestor");

solicitud.row = data => {
	const acciones = solicitud.rowActions(data);
	return `<tr class="tb-data">
		<td class="text-center"><a href="#rcView" class="row-action">${data.codigo}</a></td>
		<td class="hide-sm text-upper1">${solicitud.getTitulo()}</td>
		<td class="${solicitud.getStyleByEstado()} table-refresh" data-refresh="text-render" data-template="@getDescEstado;">${solicitud.getDescEstado()}</td>
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

solicitud.validate = data => { 
	const valid = i18n.getValidators();
	valid.isKey("acTercero", data.idTercero, "Debe seleccionar un tercero válido"); // autocomplete required key
	valid.isKey("delegacion", data.idDelegacion, "Debe seleccionar una delegación del tercero"); // desplegable de las delegaciones
	valid.isKey("acOrganica", data.idOrganica, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
	if (solicitud.isRecibo()) //subtipo = ttpp o extension
		valid.size("acRecibo", data.acRecibo, "Debe indicar un número de recibo válido");
	/*if (solicitud.isDeportes()) {
		valid.size("extra", data.extra, "errRequired", "Debe indicar un número de recibo válido"); // Required string
		valid.leToday("fMax", data.fMax, "Debe indicar la fecha del recibo asociado"); // Required date
	}*/
	//valid.size("memo", data.memo, "Debe indicar las observaciones asociadas a la solicitud."); // Required string
	if (solicitud.isFace())
		valid.size("og", data.og) && valid.size("oc", data.oc) && valid.size("ut", data.ut);
	if (solicitud.isPlataforma())
		valid.size("og", data.og);
	return valid.isOk() && lineas.validate();
}

export default solicitud;
