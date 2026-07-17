
import Solicitud from "../../core/model/Solicitud.js";

class Beca extends Solicitud {
	getUrl = () => "/uae/becas"; // endpoint base path
	getTitulo = () => "Solicitud SPI";
}

export default new Beca();
