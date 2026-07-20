
import Solicitud from "../../core/model/Solicitud.js";

class Pedido extends Solicitud {
	getUrl = () => "/uae/pedido"; // endpoint base path
	getTitulo = () => ("Solicitud de pedidos de Infraestructuras " + (this.get("codigo") || ""));
	getNifNameProv = () => (this.getNif() + " - " + this.get("prov"));

	isAceptado = () => (this.getEstado() === 1);
	isAprobado = () => (this.getEstado() === 4);
	isAplicado = () => (this.getEstado() === 14);
	isValidada = () => (this.isFirmada() || this.isIntegrada() || this.isAplicado()); // Override super arrow function
	isDocumentable = () => (this.isValidada() || this.isErronea()); // Muestra el boton de informe pdf

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
