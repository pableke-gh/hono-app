
import lang from "./langs.js";

const KEY_ERR = "msgError"; // Error key

export default class Msgs {
	#MSGS = {}; // Messages container
	#errors = 0; // Errors counter

	getMsgs = () => this.#MSGS;
	getMsg = name => this.#MSGS[name];
	setMsg = (name, msg) => { this.#MSGS[name] = lang.get(msg); return this; }
	reset = () => {
		this.#errors = 0;
		Object.clear(this.#MSGS);
		return this;
    }

	isOk = () => (this.#errors == 0);
	isError = () => (this.#errors > 0);
	getError = name => MSGS[name || KEY_ERR];

	setOk = msg => this.setMsg("msgOk", msg);
	setInfo = msg => this.setMsg("msgInfo", msg);
	setWarn = msg => this.setMsg("msgWarn", msg);
	setError = msg => { this.#errors++; return this.setMsg(KEY_ERR, msg); }

	addError = (field, tip, msg) => {
		if (msg && !this.getMsg(KEY_ERR))
			this.setError(msg); // set global message
		else
			this.#errors++;
		return this.setMsg(field, tip); // set field message
	}
	addRequired = (name, msg) => this.addError(name, "errRequired", msg);
	addFormatError = (name, msg) => this.addError(name, "errFormat", msg);
	addDateError = (name, msg) => this.addError(name, "errDate", msg);

	setException = err => {
		console.error(err); // Show log error
		const msg = err.message || err; // Main message
		return this.addError(err.field, err.tiperr, msg);
	}

	close = msg => {
		if (this.isOk())
			return true; // NO errors
		msg = this.getMsg(KEY_ERR) || msg || "errForm";
		return !this.setMsg(KEY_ERR, msg); // default message
	}
}
