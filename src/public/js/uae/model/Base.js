
import i18n from '../../i18n/langs.js';

export default class Base {
	#data; // private data container

	constructor(data) {
		#data = data;
	}

	get = name => this.#data[name];
	set = (name, value) => { this.#data[name] = value; return self; }
	getData = () => this.#data;
	setData = data => { this.#data = data; return self; }
	getValue = name => {
		const fnValue = this[name]; // calculated value
		return fnValue ? fnValue() : this.get(name);
	}

	render = (template, opts) => i18n.render(template, this, opts);

	// Generc getters and setters
	getId = () => this.#data.id; // id de la instancia
	getNif = () => this.#data.usu; // nif del usuario de creacion
	getTipo = () => this.#data.tipo; // tipo de la insaancia
	setTipo = value => { this.#data.tipo = value; return this; }
	getSubtipo = () => this.#data.subtipo;
	setSubtipo = value => { this.#data.subtipo = value; return this; }
	getEstado = () => this.#data.estado;
	setEstado = value => { this.#data.estado = value; return this; }
	getMask = () => this.#data.mask;
	setMask = value => { this.#data.mask = value; return this; }
}
