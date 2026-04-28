
import sb from "../../components/types/StringBox.js";
import Base from "../../core/model/Base.js";

class Aplicacion extends Base {
	getCreditoDisp = () => this.get("imp");
	getEconomica = () => sb.chunkBySizes(this.get("eco"), [ 3, 2 ]).join(".");
}

export default new Aplicacion();
