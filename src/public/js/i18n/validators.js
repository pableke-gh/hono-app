
import Msgs from "./msgs.js";
import Banks from "./validators/Banks.js";
import PersonId from "./validators/PersonId.js";

// RegEx for validating
/*const RE_IPv4 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
const RE_IPv6 = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
const RE_URL = /(http|fttextp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;*/

function fnSize(valid, name, value, max, msg) {
	if (!value) // String length validations
		return !valid.addRequired(name, msg);
	if (value.length > max)
		 !valid.addError(name, "errMaxlength", msg);
	return true;
}
function fnDate(valid, name, value, msg) {
	if (!value) // iso date validation
		return !valid.addRequired(name, msg); // required
	const ok = /^\d{4}-[01]\d-[0-3]\d/.test(value); // RE_DATE format
	return ok || !valid.addDateError(name, msg);
}

export default class Validators extends Msgs {
	static #sysdate = (new Date()).toISOString();

	#personId = new PersonId(this);
	#banks = new Banks(this);

	// read only instance validators
	get personId() { return this.#personId; }
	get banks() { return this.#banks; }

	gt(name, value, min, msgtip, msg) { return (value && (value > min)) ? this : this.addError(name, msgtip, msg); } // required gt min
	gt1(name, value, msgtip, msg) { return this.gt(name, value, 1, msgtip, msg); } // required gt1
	gt0(name, value, msg) { return this.gt(name, value, 0, "errGt0", msg); } // required gt0
	ge(name, value, min, msgtip, msg) { return (!value || (value >= min)) ? this : this.addError(name, msgtip, msg); } // optional or ge min
	ge1(name, value, msgtip, msg) { return this.ge(name, value, 1, msgtip, msg); } // optional or ge1
	ge0(name, value, msg) { return this.ge(name, value, 0, "errGt0", msg); } // optional or ge0
	max(name, value, max, msg) { return (!value || (value.length <= max)) ? this : this.addError(name, "errMaxlength", msg); } // optional or length <= max
	le(name, value, max, msgtip, msg) { return (value && (value > 0) && (value <= max)) ? this : this.addError(name, msgtip, msg); } // required gt0 and le max
	le10(name, value, msgtip, msg) { return this.le(name, value, 10, msgtip, msg); } // required gt0 and le 10
	le20(name, value, msgtip, msg) { return this.le(name, value, 20, msgtip, msg); } // required gt0 and le 20
	le25(name, value, msgtip, msg) { return this.le(name, value, 25, msgtip, msg); } // required gt0 and le 25
	le50(name, value, msgtip, msg) { return this.le(name, value, 50, msgtip, msg); } // required gt0 and le 50
	isKey(name, value, msg) { // Required DB-key
		if (!value)
			return this.addRequired(name, msg);
		return (value > 0) ? this : this.addError(name, "notFound", msg);
	}

	// required and length <= max (Default max size == 1000)
	size(name, value, msg, max) { fnSize(this, name, value, max ?? 1000, msg); return this; }
	size20(name, value, msg) { fnSize(this, name, value, 20, msg); return this; }
	size50(name, value, msg) { fnSize(this, name, value, 50, msg); return this; }
	size100(name, value, msg) { fnSize(this, name, value, 100, msg); return this; }
	size200(name, value, msg) { fnSize(this, name, value, 200, msg); return this; }
	size250(name, value, msg) { fnSize(this, name, value, 250, msg); return this; }
	size500(name, value, msg) { fnSize(this, name, value, 500, msg); return this; }

	isEmail(name, value, msg) {
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		const ok = /\w+[^\s@]+@[^\s@]+\.[^\s@]+/.test(value); // RE_MAIL format
		return ok ? this : this.addError(name, "errCorreo", msg);
	}
	isLogin(name, value, msg) { // Loggin / Password / Code
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		if (value.length < 8)
			return this.addError(name, "errMinlength8", msg); // min length
		const ok = /^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{6,}$/.test(value); // RE_LOGIN format
		return ok ? this : this.addFormatError(name, msg);
	}

	word(name, value, msg) {
		if (!fnSize(this, name, value, 50, msg))
			return this; // size message error
		const ok = /\w+/.test(value); // RE_WORD format
		return ok ? this : this.addFormatError(name, msg);
	}
	words(name, value, msg) {
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		const ok = /^\w+(,\w+)*$/.test(value); // RE_WORDS format
		return ok ? this : this.addFormatError(name, msg);
	}
	digits(name, value, msg) {
		if (!fnSize(this, name, value, 20, msg))
			return this; // size message error
		const ok = /^[1-9]\d*$/.test(value); // RE_DIGITS format
		return ok ? this : this.addFormatError(name, msg);
	}
	numbers(name, value, msg) {
		if (!fnSize(this, name, value, 200, msg))
			return this; // size message error
		const ok = /^\d+(,\d+)*$/.test(value); // RE_NUMBERS format
		return ok ? this : this.addFormatError(name, msg);
	}

	// Date validations in string iso format (ej: "2022-05-11T12:05:01")
	isDate(name, value, msg) {
		fnDate(this, name, value, msg);
		return this;
	}
	isTime(name, value, msg) {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d:[0-5]\d[\.\d{1,3}]?$/.test(value); // RE_TIME format
		return ok ? this : this.addDateError(name, msg);
	}
	isDateTime(name, value, msg) {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}Z$/.test(value); // RE_DATE_TIME format
		return ok ? this : this.addDateError(name, msg);
	}
	past(name, value, msg) {
		if (!fnDate(this, name, value, msg))
			return this; // format message error
		if (value.substring(0, 19) > Validators.#sysdate.substring(0, 19)) //yyyy-mm-ddThh:MM:ss
			return this.addError(name, "errDateLt", msg); // not in time
		return this;
	}
	leToday(name, value, msg) {
		if (!fnDate(this, name, value, msg))
			return this; // format message error
		if (value.substring(0, 10) > Validators.#sysdate.substring(0, 10))
			return this.addError(name, "errDateLe", msg); // not in time
		return this;
	}
	geToday(name, value, msg) {
		if (!fnDate(this, name, value, msg))
			return this; // format message error
		if (value.substring(0, 10) < Validators.#sysdate.substring(0, 10))
			return this.addError(name, "errDateGe", msg); // not in time
		return this;
	}

	generatePassword(size, charSet) {
		charSet = charSet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$";
		return Array.apply(null, Array(size || 10)).map(() => charSet.charAt(Math.random() * charSet.length)).join(""); 
	}
	testPassword(pass) {
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
