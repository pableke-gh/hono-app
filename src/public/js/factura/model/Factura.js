
import Messages from "../../core/i18n/Messages.js";
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
	isSubsanableUae = () => (this.isSubsanable() && this.isUae());
	isSubsanableGaca = () => (this.isSubsanable() && this.isGaca());

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
	getImpIva = () => 0; // importes calculados default = 0
	getImpTotal = () => 0; // importes calculados default = 0

	isConceptos = () => !this.isTtppEmpresa();
	isGrupoFace = () => (this.isFacturable() && !this.isTtppEmpresa());
	isFace = () => (this.isGrupoFace() && (this.get("face") == 1)); //factura electronica FACe
	isPlataforma = () => (this.isGrupoFace() && (this.get("face") == 2)); //factura electronica Otras
	setFace = val => this.set("face", val); // update plataforma / FACe

	validate(data) {
		const msgs = new Messages(); // validate messages
		if (!data.idTer || (data.idTer < 1)) // autocomplete required
			msgs.setFail("tercero", "Debe seleccionar un tercero válido");
		if (!data.delegacion || (data.delegacion < 1)) // desplegable de las delegaciones
			msgs.setFail("delegacion", "Debe seleccionar una delegación del tercero");
		if (!data.idOrg || (data.idOrg < 1)) // autocomplete required
			msgs.setFail("organica", "No ha seleccionado correctamente la orgánica");
		if (this.isUae() && (!data.idEco || (data.idEco < 1))) // economica required
			msgs.setFail("idEco", "Debe asociar una económica de ingreso a la solicitud.");
		if (this.isFace() && !data.og) // validaciones para FACe
			msgs.setFail("og", "Debe indicar el órgano gestor asociado a la factura");
		if (this.isPlataforma() && !data.og)
			msgs.setFail("og", "Debe indicar la plataforma asociada");
		return msgs;
	}
}

export default new Factura();
