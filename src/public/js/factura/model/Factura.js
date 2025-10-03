
import i18n from "../../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import fact from "../../xeco/model/Solicitud.js";
import lineas from "./Lineas.js";

const TITULOS = [ "-", "factura", "abono", "carta de pago", "factura de TTPP", "factura de congreso", "factura de TTPP empresas" ];

fact.getUrl = () => "/uae/fact";
fact.getLineas = () => lineas;
fact.setLineas = table => { lineas.setData(table.getData()); return fact; }
fact.getLinea = lineas.getLinea;

fact.getTitulo = () => TITULOS[fact.getTipo()] || TITULOS[1];
fact.isFactura = () => (fact.getTipo() == 1);
//fact.isAbono = () => (fact.getTipo() == 2);
fact.isCartaPago = () => (fact.getTipo() == 3);
fact.isReciboCV = () => (fact.getTipo() == 4); // viene de CV
fact.isCongresoCV = () => (fact.getTipo() == 5); // viene de CV
fact.isTtppEmpresa = () => (fact.getTipo() == 6); // TTPP a empresa
fact.isFacturable = () => (fact.isFactura() || fact.isReciboCV() || fact.isCongresoCV() || fact.isTtppEmpresa());
fact.isFirmaGaca = () => (fact.isReciboCV() && fact.isTtpp() && (fact.getMask() & 2));
//fact.isReactivable = () => ((fact.isUae() && fact.isErronea()) || (fact.isGaca() && fact.isRechazada()));
fact.isEditableGaca = () => (fact.isEditableUae() || (fact.isGaca() && fact.isFirmable()));

fact.isTtpp = () => (fact.getSubtipo() == 3);
fact.isTituloOficial = () => (fact.getSubtipo() == 4);
fact.isExtension = () => (fact.getSubtipo() == 9);
fact.isDeportes = () => (fact.getSubtipo() == 10);
fact.isCongresoGdi = () => (fact.getSubtipo() == 24);
fact.isRecibo = () => ((fact.isTtpp() || fact.isTituloOficial() || fact.isExtension() || fact.isCongresoGdi()) && !fact.isTtppEmpresa());
fact.setSujeto = val => fact.set("sujeto", val);
fact.isExento = () => !fact.get("sujeto");
fact.setExento = val => fact.set("exento", val);
fact.isMemo = () => (fact.isFirmaGaca() || fact.isTtppEmpresa());

fact.getIva = () => fact.get("iva");
fact.setIva = imp => fact.set("iva", imp ?? 0);
fact.setNifTercero = nif => fact.set("nif", nif); 
fact.getImpIva = () => 0; // importes calculados default = 0
fact.getImpTotal = () => 0; // importes calculados default = 0

fact.isConceptos = () => !fact.isTtppEmpresa();
fact.isGrupoFace = () => (fact.isFacturable() && !fact.isTtppEmpresa());
fact.isFace = () => (fact.get("face") == 1); //factura electronica FACe
fact.isPlataforma = () => (fact.get("face") == 2); //factura electronica Otras
fact.setFace = val => fact.set("face", val); // update plataforma / FACe
fact.getNamePlataforma = () => (fact.isPlataforma() ? "Nombre de la plataforma" : "Órgano Gestor");

fact.row = data => {
	const acciones = fact.rowActions(data);
	return `<tr class="tb-data">
		<td class="text-center"><a href="#view">${data.codigo}</a></td>
		<td class="hide-sm text-upper1">${fact.getTitulo()}</td>
		<td class="${fact.getStyleByEstado()} hide-xs table-refresh" data-refresh="text-render" data-template="@getDescEstado;">${fact.getDescEstado()}</td>
		<td class="text-center hide-xs">${firma.myFlag(data)}</td>
		<td class="hide-sm">${data.sig || ""}</td>
		<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
		<td class="text-right">${i18n.isoFloat(data.imp)} €</td>
		<td>${data.nif}</td><td class="hide-xs">${data.tercero}</td>
		<td>${data.org}</td><td class="hide-sm">${data.descOrg}</td>
		<td class="hide-sm">${data.name}</td>
		<td class="text-right no-print">${acciones}</td>
	</tr>`;
}

fact.validate = data => { 
	const valid = i18n.getValidators();
	valid.isKey("acTercero", data.idTer, "Debe seleccionar un tercero válido"); // autocomplete required key
	valid.isKey("delegacion", data.idDel, "Debe seleccionar una delegación del tercero"); // desplegable de las delegaciones
	valid.isKey("acOrganica", data.idOrg, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
	if (fact.isRecibo()) //subtipo = ttpp o extension
		valid.size("acRecibo", data.acRecibo, "Debe indicar un número de recibo válido");
	/*if (fact.isDeportes()) {
		valid.size("extra", data.extra, "errRequired", "Debe indicar un número de recibo válido"); // Required string
		valid.leToday("fMax", data.fMax, "Debe indicar la fecha del recibo asociado"); // Required date
	}*/
	if (fact.isTtppEmpresa()) // Required string
		valid.size("memo", data.memo, "Debe indicar las observaciones asociadas a la fact.");
	if (fact.isFace())
		valid.size("og", data.og) && valid.size("oc", data.oc) && valid.size("ut", data.ut);
	if (fact.isPlataforma())
		valid.size("og", data.og);
	return lineas.validate();
}

export default fact;
