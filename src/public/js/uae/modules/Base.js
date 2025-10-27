
export default class Base {
	#model;

	constructor(model) {
		this.#model = model;
	}

	getModel = () => this.#model;
	getId = () => this.#model.getId();
	setData = data => { this.#model.setData(data); }
	isCached = id => (id == this.getId());

	init = () => {
	}
}
