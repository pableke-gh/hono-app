
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

	load(data) { // preserva la economica precalculada
		this.set("id", data.id).set("ej", data.ej); // id de la nueva aplicacion
		this.set("org", data.org).set("func", data.func).set("desc", data.desc);
		return this.set("imp", data.imp || 0); // siempre muestro un importe
	}
	unload() { // preserva la economica precalculada
		const data = this.getData();
		delete data.id; delete data.ej;
		delete data.org; delete data.func;
		delete data.imp; delete data.desc;
	}
}

export default new Aplicacion();
