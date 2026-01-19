
import i18n from "../../i18n/langs.js";
import firma from "../../xeco/model/Firma.js";
import Solicitud from "../../xeco/model/Solicitud.js";
import lineas from "./Lineas.js";

const TITULOS = [ "-", "factura", "abono", "carta de pago", "factura de TTPP", "factura de congreso", "factura de TTPP empresas" ];

class Factura extends Solicitud {
	build = () => new Factura(); // Override create a new instance
	getUrl = () => "/uae/fact"; // Override url base path
	getLineas = () => lineas; // lineas de factura
	setLineas = table => { lineas.setData(table.getData()); return this; }
	getLinea = lineas.getLinea;

	getTitulo = () => TITULOS[this.getTipo()] || TITULOS[1];
	isFactura = () => (this.getTipo() == 1);
	//this.isAbono = () => (this.getTipo() == 2);
	isCartaPago = () => (this.getTipo() == 3);
	isReciboCV = () => (this.getTipo() == 4); // viene de CV
	isCongresoCV = () => (this.getTipo() == 5); // viene de CV
	isFacturable = () => (this.isFactura() || this.isReciboCV() || this.isCongresoCV());
	isFirmaGaca = () => (this.isReciboCV() && this.isTtpp() && (this.getMask() & 2));

	isGaca = () => (this.get("grp") == 2); // grupo de firma = gaca
	isReactivable = () => ((this.isUae() && this.isErronea()) || (this.isGaca() && this.isRechazada()));
	isEditableGaca = () => (this.isEditableUae() || (this.isGaca() && this.isFirmable()));

	isTtpp = () => (this.getSubtipo() == 3);
	isTituloOficial = () => (this.getSubtipo() == 4);
	isTtppEmpresa = () => (this.getSubtipo() == 25); // TTPP a empresa
	isExtension = () => (this.getSubtipo() == 9);
	isDeportes = () => (this.getSubtipo() == 10);
	isCongresoGdi = () => (this.getSubtipo() == 24);
	isRecibo = () => (this.isTtpp() || this.isTituloOficial() || this.isExtension() || this.isCongresoGdi());
	setSujeto = val => this.set("sujeto", val);
	isExento = () => !this.get("sujeto");
	setExento = val => this.set("exento", val);
	isMemo = () => (this.isFirmaGaca() || this.isTtppEmpresa());

	getIva = () => this.get("iva");
	setIva = imp => this.set("iva", imp ?? 0);
	setNifTercero = nif => this.set("nif", nif); 
	getImpIva = () => 0; // importes calculados default = 0
	getImpTotal = () => 0; // importes calculados default = 0

	isConceptos = () => !this.isTtppEmpresa();
	isGrupoFace = () => (this.isFacturable() && !this.isTtppEmpresa());
	isFace = () => (this.get("face") == 1); //factura electronica FACe
	isPlataforma = () => (this.get("face") == 2); //factura electronica Otras
	setFace = val => this.set("face", val); // update plataforma / FACe

	row = data => {
		let acciones = this.getTplActions(data);
		return `<tr class="tb-data">
			<td class="text-center"><a href="#view">${data.codigo}</a></td>
			<td class="hide-sm text-upper1">${this.getTitulo()}</td>
			<td class="${this.getStyleByEstado()} hide-xs table-refresh" data-refresh="update-estado">${this.getDescEstado()}</td>
			<td class="text-center hide-xs">${firma.myFlag(data)}</td>
			<td class="hide-sm">${data.sig || ""}</td>
			<td class="text-center hide-xs">${i18n.isoDate(data.fCreacion)}</td>
			<td class="currency">${i18n.isoFloat(data.imp)} €</td>
			<td>${data.nif}</td><td class="hide-xs">${data.tercero}</td>
			<td>${data.org}</td><td class="hide-sm">${data.descOrg}</td>
			<td class="hide-sm">${data.name}</td>
			<td class="currency no-print">${acciones}</td>
		</tr>`;
	}

	validate = data => { 
		const valid = i18n.getValidators();
		valid.isKey("acTercero", data.idTer, "Debe seleccionar un tercero válido"); // autocomplete required key
		valid.isKey("delegacion", data.idDel, "Debe seleccionar una delegación del tercero"); // desplegable de las delegaciones
		valid.isKey("acOrganica", data.idOrg, "No ha seleccionado correctamente la orgánica"); // autocomplete required key
		if (this.isRecibo()) //subtipo = ttpp o extension
			valid.size("acRecibo", data.acRecibo, "Debe indicar un número de recibo válido");
		/*if (this.isDeportes()) {
			valid.size("extra", data.extra, "errRequired", "Debe indicar un número de recibo válido"); // Required string
			valid.leToday("fMax", data.fMax, "Debe indicar la fecha del recibo asociado"); // Required date
		}*/
		if (this.isTtppEmpresa()) // Required string
			valid.size("memo", data.memo, "Debe indicar las observaciones asociadas a la factura.");
		if (this.isFace())
			valid.word20("og", data.og).word9("oc", data.oc).word9("ut", data.ut).word10("op", data.op);
		if (this.isPlataforma())
			valid.size("og", data.og);
		return lineas.validate();
	}
}

export default new Factura();
