
import Solicitud from "../../core/model/Solicitud.js";

class Pedido extends Solicitud {
	getUrl = () => "/uae/pedido"; // endpoint base path
	getTitulo = () => "Solicitud SPI";
	isDocumentable = () => (this.isValidada() || this.isErronea()); // muestra el boton de informe pdf

	getAdjunto = () => this.get("file");
	getImporte = () => this.get("imp");
	setImporte = imp => this.set("imp", imp);
	getIva = () => this.get("iva");
	setIva = iva => this.set("iva", iva);

	getImpIva = () => (this.getImporte() * (this.getIva() / 100));
	getProrrata = () => this.get("prorrata");
	getImpTotal = () => (this.getImporte() + this.getImpIva());
	getImpPpto = () => (this.getImpTotal() - ((this.getProrrata() / 100) * this.getImpIva()));
}

export default new Pedido();
