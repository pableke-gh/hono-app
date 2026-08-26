
const KEY_ERR = "msgError"; // Error key

export default class Messages {
	#MSGS = {}; // Messages container
	#errors = 0; // Errors counter

	getMsgs = () => this.#MSGS;
	getMsg = name => this.#MSGS[name];
	setMsg(name, msg) { this.#MSGS[name] = msg; return this; }

	isOk = () => (this.#errors == 0);
	isError = () => (this.#errors > 0);
	getError = name => this.#MSGS[name || KEY_ERR];
	setError(name, tip, msg) {
		this.#errors++; // increment error counter
		msg && this.setMsg(KEY_ERR, msg); // set global message
		return this.setMsg(name, tip); // set field message
	}
	setFail(name, msg) {
		this.#errors++; // increment error counter
		this.setMsg(KEY_ERR, msg); // set global message
		return this.setMsg(name, msg); // set field message
	}
}
