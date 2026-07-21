
import Solicitud from "../../core/model/Solicitud.js";

class Beca extends Solicitud {
	getUrl = () => "/uae/becas"; // endpoint base path
	getTitulo = () => ("Comunicación de subvenciones, becas y premios " + (this.get("codigo") || ""));

	// ficheros adjuntos
	getBases = () => this.get("bases");
	getResolucion = () => this.get("resolucion");
	getBeneficiarios = () => this.get("beneficiarios");
}

export default new Beca();
