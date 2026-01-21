
import i18n from "../../i18n/langs.js";
import linea from "./Linea.js";

class Lineas {
	#data; // Current presto data type
	
	getData = () => this.#data;
	setData = lineas => { this.#data = lineas; return this; }

	getLinea = () => linea;
	size = () => JSON.size(this.#data);
	isEmpty = () => !this.size();

	validate = () => { // Todas las solicitudes tienen partidas a incrementar
		const valid = i18n.getValidation(); // Continue with validation without reset
		const msg = "Debe detallar los conceptos asociados a la solicitud.";
		return this.#data.length ? valid.isOk() : !valid.addError("desc", "errRequired", msg).addError("acTTPP", "errRequired", msg);
	}
}

export default new Lineas();
