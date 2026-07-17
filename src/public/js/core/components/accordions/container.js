
class AccordionsContainer {
	#accordions = {}; // all accordions container
	#opts = { msgEmptyTable: "noResults" }; // default empty table message
	#main; // main loaded accordion

	getOptions = () => this.#opts;
	getAll = () => this.#accordions;
	get = name => this.#accordions[name];
	set(name, table) { this.#accordions[name] = table; } // register named tables

	getMain = () => this.#main; // main loaded accordion
	setMain(accordion) { this.#main = accordion; } // accordion loaded

	reset() {
		for (const key in this.#accordions)
			this.get(key).reset();
		this.setMain(null);
	}
}

export default new AccordionsContainer();
