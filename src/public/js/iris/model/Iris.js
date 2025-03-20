
import Solicitud from "../../xeco/model/Solicitud";
import organica from "./Organica.js";
import rutas from "./ruta/Rutas";
import gastos from "./gasto/Gastos";

class Iris extends Solicitud {
	getOrganica() { return organica; }
	getRutas() { return rutas; }
	getGastos() { return gastos; }
}

export default new Iris();
