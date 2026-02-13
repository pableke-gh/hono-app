
import Solicitud from "../../core/model/Solicitud.js";

const TITULOS = [ "-", "factura", "abono", "carta de pago", "factura de TTPP", "factura de congreso", "factura de TTPP empresas" ];

class Factura extends Solicitud {
	build = () => new Factura(); // Override create a new instance
	getUrl = () => "/uae/fact"; // Override url base path

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
}

export default new Factura();
