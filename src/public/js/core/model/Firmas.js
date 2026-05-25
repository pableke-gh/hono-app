
import coll from "../../components/CollectionHTML.js";
import firma from "./Firma.js";

class Firmas {
	#firmas;

	getFirmas = () => this.#firmas;
	size = () => coll.size(this.#firmas);
	isEmpty = () => coll.isEmpty(this.#firmas);
	setFirmas = data => { this.#firmas = data; return this; }
	reset() { this.#firmas = null; }

	getPrincipales = () => this.#firmas.slice(1); // remove grupo gestor
	render = () => this.#firmas.slice(1).map(firma.render).join(""); // render principales

	getByGrupo = grupo => this.#firmas.find(firma => firma.grupo == grupo);
	getRechazada = () => this.#firmas.find(firma.isRechazada);
}

export default new Firmas();
