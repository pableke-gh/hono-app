
const KEY_ERR = "msgError"; // Error key

export default class Msgs {
    #lang; // private lang object (readonly)
    #MSGS = {}; // Messages container
    #errors = 0; // Errors counter

    constructor(lang) {
        this.#lang = lang;
    }

	get lang() { return this.#lang; }
	getLang() { return this.lang; }

	get msgs() { return this.#MSGS; }
	getMsgs() { return this.msgs; }
	getMsg(name) { return this.#MSGS[name]; }
	setMsg(name, msg) {
		this.#MSGS[name] = this.lang[msg] || msg;
		return this;
	}
	reset() {
		this.#errors = 0;
		Object.clear(this.#MSGS);
		return this;
    }

	isOk() { return (this.#errors == 0); }
	isError() { return (this.#errors > 0); }
	getError(name) { return this.#MSGS[name || KEY_ERR]; }

	setOk(msg) { return this.setMsg("msgOk", msg); }
	setInfo(msg) { return this.setMsg("msgInfo", msg); }
	setWarn(msg) { return this.setMsg("msgWarn", msg); }
	setError(msg) {
		this.#errors++;
		return this.setMsg(KEY_ERR, msg);
	}

    addError(field, tip, msg) {
        if (msg && !this.getMsg(KEY_ERR))
            this.setError(msg); // set global message
        else
            this.#errors++;
        return this.setMsg(field, tip); // set field message
	}
	addRequired(name, msg) { return this.addError(name, "errRequired", msg); }
	addFormatError(name, msg) { return this.addError(name, "errFormat", msg); }
	addDateError(name, msg) { return this.addError(name, "errDate", msg); }

    setException(err) {
        console.error(err); // Show log error
        const msg = err.message || err; // Main message
        return this.addError(err.field, err.tiperr, msg);
    }

    close(msg) {
        if (this.isOk())
            return true; // NO errors
		msg = this.getMsg(KEY_ERR) || msg || "errForm";
		return !this.setMsg(KEY_ERR, msg); // default message
    }
}
