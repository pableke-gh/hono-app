
import sb from "../../components/types/StringBox.js";
import Solicitud from "../../core/model/Solicitud.js";
import categorias from "../data/categorias.js";

class Pedido extends Solicitud {
	getUrl = () => "/uae/pedido"; // endpoint base path
	getTitulo = () => "Solicitud SPI";

	getAdjunto = () => this.get("file");
	getImporte = () => this.get("imp");
	setImporte = imp => this.set("imp", imp);
	getIva = () => this.get("iva");
	setIva = iva => this.set("iva", iva);

	getImpIva = () => (this.getImporte() * (this.getIva() / 100));
	getProrrata = () => categorias.getProrrata(sb.getYear(this.get("fecha")));
	getImpTotal = () => (this.getImporte() + this.getImpIva());
	getImpPpto = () => (this.getImpTotal() - ( (this.getProrrata() / 100) * this.getImpIva()));
}

export default new Pedido();
