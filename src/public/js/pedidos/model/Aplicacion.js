
import sb from "../../components/types/StringBox.js";
import Base from "../../core/model/Base.js";

class Aplicacion extends Base {
	getEjercicio = () => this.get("ej");
	getOrganica = () => this.get("org");
	getFuncional = () => this.get("func");

	getEconomica = () => sb.chunkBySizes(this.get("eco"), [ 3, 2 ]).join(".");
	setEconomica = economica => this.set("eco", economica);

	getCreditoDisp = () => this.get("imp");
	getDescripcion = () => this.get("desc");
}

export default new Aplicacion();
