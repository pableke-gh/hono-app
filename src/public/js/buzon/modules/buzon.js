
import Form from "../../components/forms/Form.js";
import Ancladas from "./tables/ancladas.js";
import Recientes from "./tables/recientes.js";
import Facturas from "./tabs/facturas.js";
import Usuarios from "./tabs/usuarios.js";

class Buzon extends Form {
	#ancladas = new Ancladas(this);
	#recientes = new Recientes(this);

	#facturas = new Facturas(this);
	#usuarios = new Usuarios(this);

	constructor() {
		super("#xeco-model");
	}

	init() {
		this.#ancladas.init();
		this.#recientes.init();

		this.#facturas.init();
		this.#usuarios.init();
		return this;
	}

	getAncladas = () => this.#ancladas;
	getRecientes = () => this.#recientes;

	getFacturas = () => this.#facturas;
	getUsuarios = () => this.#usuarios;
}

export default new Buzon();
