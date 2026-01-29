
import Msgs from "./msgs.js";
import banks from "./validators/banks.js";

// RegEx for validating
/*const RE_IPv4 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
const RE_IPv6 = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
const RE_URL = /(http|fttextp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;*/

export default class Validators extends Msgs {
	#sysdate = (new Date()).toISOString();

	// read only instance validators
	getBanks = () => banks;

	gt = (name, value, min, msgtip, msg) => { // required gt min
		if (!globalThis.isset(value))
			return this.addRequired(name, msg); // required
		return (value > min) ? this : this.addError(name, msgtip || "notAllowed", msg); 
	}
	gt1 = (name, value, msgtip, msg) => this.gt(name, value, 1, msgtip, msg); // required gt1
	gt0 = (name, value, msg) => this.gt(name, value, 0, "errGt0", msg); // required gt0
	ge = (name, value, min, msgtip, msg) => (!value || (value >= min)) ? this : this.addError(name, msgtip, msg); // optional or ge min
	ge1 = (name, value, msgtip, msg) => this.ge(name, value, 1, msgtip, msg); // optional or ge1
	ge0 = (name, value, msg) => this.ge(name, value, 0, "errGt0", msg); // optional or ge0
	max = (name, value, max, msg) => (!value || (value.length <= max)) ? this : this.addError(name, "errMaxlength", msg); // optional or length <= max 

	le = (name, value, max, msgtip, msg) => { // required gt0 and le max
		if (!globalThis.isset(value))
			return this.addRequired(name, msg);
		return ((value > 0) && (value <= max)) ? this : this.addError(name, msgtip || "notAllowed", msg);
	}
	le10 = (name, value, msgtip, msg) => this.le(name, value, 10, msgtip, msg); // required gt0 and le 10
	le20 = (name, value, msgtip, msg) => this.le(name, value, 20, msgtip, msg); // required gt0 and le 20
	le25 = (name, value, msgtip, msg) => this.le(name, value, 25, msgtip, msg); // required gt0 and le 25
	le50 = (name, value, msgtip, msg) => this.le(name, value, 50, msgtip, msg); // required gt0 and le 50
	isKey = (name, value, msg) => { // Required DB-key
		if (!value)
			return this.addRequired(name, msg);
		return (value > 0) ? this : this.addError(name, "notFound", msg);
	}

	// required and length <= max (Default max size == 1000)
	#size(name, value, max, msg) {
		if (!value) // String length validations
			return !this.addRequired(name, msg);
		if (value.length > max)
			return !this.addError(name, "errMaxlength", msg);
		return true;
	}
	size = (name, value, msg, max) => { this.#size(name, value, max ?? 1000, msg); return this; }
	size20 = (name, value, msg) => { this.#size(name, value, 20, msg); return this; }
	size50 = (name, value, msg) => { this.#size(name, value, 50, msg); return this; }
	size100 = (name, value, msg) => { this.#size(name, value, 100, msg); return this; }
	size200 = (name, value, msg) => { this.#size(name, value, 200, msg); return this; }
	size250 = (name, value, msg) => { this.#size(name, value, 250, msg); return this; }
	size500 = (name, value, msg) => { this.#size(name, value, 500, msg); return this; }

	isEmail = (name, value, msg) => {
		if (!this.#size(name, value, 200, msg))
			return this; // size message error
		const ok = /\w+[^\s@]+@[^\s@]+\.[^\s@]+/.test(value); // RE_MAIL format
		return ok ? this : this.addError(name, "errCorreo", msg);
	}
	isLogin = (name, value, msg) => { // Loggin / Password / Code
		if (!this.#size(name, value, 200, msg))
			return this; // size message error
		if (value.length < 8)
			return this.addError(name, "errMinlength8", msg); // min length
		const ok = /^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{6,}$/.test(value); // RE_LOGIN format
		return ok ? this : this.addFormatError(name, msg);
	}

	word = (name, value, msg, size) => {
		size = size ?? 50; // default word length = 50
		const ok = this.#size(name, value, size, msg) && /\w+/.test(value); // RE_WORD format
		return ok ? this : this.addFormatError(name, msg);
	}
	word9 = (name, value, msg) => this.word(name, value, msg, 9);
	word10 = (name, value, msg) => this.word(name, value, msg, 10);
	word20 = (name, value, msg) => this.word(name, value, msg, 20);
	words = (name, value, msg, size) => {
		size = size ?? 200; // default max length = 200
		const ok = this.#size(name, value, size, msg) && /^\w+(,\w+)*$/.test(value); // RE_WORDS format
		return ok ? this : this.addFormatError(name, msg);
	}
	digits = (name, value, msg) => {
		if (!this.#size(name, value, 20, msg))
			return this; // size message error
		const ok = /^[1-9]\d*$/.test(value); // RE_DIGITS format
		return ok ? this : this.addFormatError(name, msg);
	}
	numbers = (name, value, msg) => {
		if (!this.#size(name, value, 200, msg))
			return this; // size message error
		const ok = /^\d+(,\d+)*$/.test(value); // RE_NUMBERS format
		return ok ? this : this.addFormatError(name, msg);
	}

	// Date validations in string iso format (ej: "2022-05-11T12:05:01")
	#date(name, value, msg) {
		if (!value) // iso date validation
			return !this.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\d/.test(value); // RE_DATE format
		return ok || !this.addDateError(name, msg);
	}
	isDate = (name, value, msg) => {
		this.#date(name, value, msg);
		return this;
	}
	isTime = (name, value, msg) => {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d:[0-5]\d(\.\d{1,3})?$/.test(value); // RE_TIME format
		return ok ? this : this.addDateError(name, msg);
	}
	isTimeShort = (name, value, msg) => {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d(:[0-5]\d\.\d{1,3})?$/.test(value); // RE_TIME format
		return ok ? this : this.addDateError(name, msg);
	}
	isDateTime = (name, value, msg) => {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}Z$/.test(value); // RE_DATE_TIME format
		return ok ? this : this.addDateError(name, msg);
	}
	past = (name, value, msg) => {
		if (!this.#date(name, value, msg))
			return this; // format message error
		if (value.substring(0, 19) > this.#sysdate.substring(0, 19)) //yyyy-mm-ddThh:MM:ss
			return this.addError(name, "errDateLt", msg); // not in time
		return this;
	}
	leToday = (name, value, msg) => {
		if (!this.#date(name, value, msg))
			return this; // format message error
		if (value.substring(0, 10) > this.#sysdate.substring(0, 10))
			return this.addError(name, "errDateLe", msg); // not in time
		return this;
	}
	geToday = (name, value, msg) => {
		if (!this.#date(name, value, msg))
			return this; // format message error
		if (value.substring(0, 10) < this.#sysdate.substring(0, 10))
			return this.addError(name, "errDateGe", msg); // not in time
		return this;
	}

	generatePassword = (size, charSet) => {
		charSet = charSet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$";
		return Array.apply(null, Array(size || 10)).map(() => charSet.charAt(Math.random() * charSet.length)).join(""); 
	}
	testPassword = pass => { 
		let strength = 0;
		//Check each group independently
		strength += /[A-Z]+/.test(pass) ? 1 : 0;
		strength += /[a-z]+/.test(pass) ? 1 : 0;
		strength += /[0-9]+/.test(pass) ? 1 : 0;
		strength += /[\W]+/.test(pass) ? 1 : 0;
		//Validation for length of password
		strength += ((strength > 2) && (pass.length > 8));
		return strength; //0 = bad, 1 = week, 2-3 = good, 4 = strong, 5 = very strong
	}
}
