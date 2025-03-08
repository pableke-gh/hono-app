
const KEY_ERR = "msgError"; // Error key

export default function Msgs(lang) {
	const self = this; //self instance
	const MSGS = {}; // Messages container
	let _lang = lang; // Current lang
	let _errors = 0; // Errors counter

	this.getLang = () => _lang;
	this.setLang = lang => {
		_lang = lang;
		return self;
	}

	this.getMsgs = () => MSGS;
	this.getMsg = name => MSGS[name];
	this.setMsg = (name, msg) => {
		MSGS[name] = _lang[msg] || msg;
		return self;
	}
	this.reset = () => {
		_errors = 0;
		Object.clear(MSGS);
		return self;
    }

	this.isOk = () => (_errors == 0);
	this.isError = () => (_errors > 0);
	this.getError = name => MSGS[name || KEY_ERR];

	this.setOk = msg => self.setMsg("msgOk", msg);
	this.setInfo = msg => self.setMsg("msgInfo", msg);
	this.setWarn = msg => self.setMsg("msgWarn", msg);
	this.setError = msg => {
		_errors++;
		return self.setMsg(KEY_ERR, msg);
	}

    this.addError = (field, tip, msg) => {
        if (msg && !self.getMsg(KEY_ERR))
		self.setError(msg); // set global message
        else
            _errors++;
        return self.setMsg(field, tip); // set field message
	}
	this.addRequired = (name, msg) => self.addError(name, "errRequired", msg);
	this.addFormatError = (name, msg) => self.addError(name, "errFormat", msg);
	this.addDateError = (name, msg) => self.addError(name, "errDate", msg);

    this.setException = err => {
        console.error(err); // Show log error
        const msg = err.message || err; // Main message
        return self.addError(err.field, err.tiperr, msg);
    }

    this.close = msg => {
        if (self.isOk())
            return true; // NO errors
		msg = self.getMsg(KEY_ERR) || msg || "errForm";
		return !self.setMsg(KEY_ERR, msg); // default message
    }
}
