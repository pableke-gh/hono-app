
class MsgContainer {
	#msgs = {}; // all msgs container

	getAll = () => this.#msgs;
	get = name => this.#msgs[name];
	set(name, elem) { this.#msgs[name] = elem; } // register named tables
}

export default new MsgContainer();
