
export default class Base {
	#data; // private data container

	constructor(data) {
		this.#data = data;
	}

	//getData = () => this.#data;
	get = name => this.#data[name];
	getValue = name => {
		const fnValue = this[name]; // calculated value
		return fnValue ? fnValue() : this.get(name);
	}

	//setData = data => { this.#data = data; return this; }
	set = (name, value) => { this.#data[name] = value; return this; }
	setValue = (name, value) => {
		const fnValue = this["set" + name.charAt(0).toUpperCase() + name.slice(1)];
		return fnValue ? fnValue(value) : this.set(name, value); // set value
	}

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
