
import i18n from '../../i18n/langs.js';

export default class Base {
	#data; // private data container

	constructor(data) {
		this.#data = data;
	}

	get = name => this.#data[name];
	set(name, value) { this.#data[name] = value; return this; }
	getData = () => this.#data;
	setData(data) { this.#data = data; return this; }

	// arrow functions do not have their own this binding; instead, they lexically inherit the this value from the enclosing scope
	// Even if the method is assigned to a variable or destructured, this context remains correctly bound to the instance => not suport super
	getValue = name => {
		const fnValue = this[name]; // calculated value
		return fnValue ? fnValue() : this.get(name);
	}

	render = (template, opts) => i18n.render(template, this, opts);

	// Generc getters and setters
	getId = () => this.#data.id; // id de la instancia
	getNif = () => this.#data.nif; // nif del usuario de creacion
	getTipo = () => this.#data.tipo; // tipo de la insaancia
	setTipo(value) { this.#data.tipo = value; return this; }
	getSubtipo = () => this.#data.subtipo;
	setSubtipo(value) { this.#data.subtipo = value; return this; }
	getEstado = () => this.#data.estado;
	setEstado(value) { this.#data.estado = value; return this; }
	getMask = () => this.#data.mask;
	setMask(value) { this.#data.mask = value; return this; }
}
