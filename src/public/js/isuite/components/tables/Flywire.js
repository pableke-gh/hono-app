
import TableHTML from "../../../core/components/Table.js";

export default class Flywire extends TableHTML {
	static #instance;
	static getInstance = () => Flywire.#instance;

	connectedCallback() {
		Flywire.#instance = this;
	}

	render(contents) {
		const data = JSON.parse(contents);
console.log('data: ', data);
		super.render(data);
	}
}
