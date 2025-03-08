
import Msgs from "./msgs.js";
import Banks from "./validators/Banks.js";
import PersonId from "./validators/PersonId.js";

// RegEx for validating
/*const RE_IPv4 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
const RE_IPv6 = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
const RE_URL = /(http|fttextp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;*/

export default function Validators(lang) {
	const self = this; //self instance
	const msgs = new Msgs(lang); // messages container
	const sysdate = (new Date()).toISOString();

	const personId = new PersonId(self);
	const banks = new Banks(self);

	// read only instance validators
	this.getPersonId = () => personId;
	this.getBanks = () => banks;

	this.getLang = msgs.getLang;
	this.setLang = lang => { msgs.setLang(lang); return self; }

	this.isOk = msgs.isOk;
	this.isError = msgs.isError;
	this.getMsgs = msgs.getMsgs;
	this.setException = msgs.setException;
	this.close = msgs.close;

	this.reset = () => { msgs.reset(); return self; }
	this.addError = (name, msgtip, msg) => { msgs.addError(name, msgtip, msg); return self; }
	this.addRequired = (name, msg) => { msgs.addRequired(name, msg); return self; }
	this.addDateError = (name, msg) => { msgs.addDateError(name, msg); return self; }
	this.addFormatError = (name, msg) => { msgs.addFormatError(name, msg); return self; }

	this.gt = (name, value, min, msgtip, msg) => { // required gt min
		if (!globalThis.isset(value))
			return self.addRequired(name, msg); // required
		return (value > min) ? self : self.addError(name, msgtip || "notAllowed", msg); 
	}
	this.gt1 = (name, value, msgtip, msg) => self.gt(name, value, 1, msgtip, msg); // required gt1
	this.gt0 = (name, value, msg) => self.gt(name, value, 0, "errGt0", msg); // required gt0
	this.ge = (name, value, min, msgtip, msg) => (!value || (value >= min)) ? self : self.addError(name, msgtip, msg); // optional or ge min
	this.ge1 = (name, value, msgtip, msg) => self.ge(name, value, 1, msgtip, msg); // optional or ge1
	this.ge0 = (name, value, msg) => self.ge(name, value, 0, "errGt0", msg); // optional or ge0
	this.max = (name, value, max, msg) => (!value || (value.length <= max)) ? self : self.addError(name, "errMaxlength", msg); // optional or length <= max 

	this.le = (name, value, max, msgtip, msg) => { // required gt0 and le max
		if (!globalThis.isset(value))
			return self.addRequired(name, msg);
		return ((value > 0) && (value <= max)) ? self : self.addError(name, msgtip || "notAllowed", msg);
	}
	this.le10 = (name, value, msgtip, msg) => self.le(name, value, 10, msgtip, msg); // required gt0 and le 10
	this.le20 = (name, value, msgtip, msg) => self.le(name, value, 20, msgtip, msg); // required gt0 and le 20
	this.le25 = (name, value, msgtip, msg) => self.le(name, value, 25, msgtip, msg); // required gt0 and le 25
	this.le50 = (name, value, msgtip, msg) => self.le(name, value, 50, msgtip, msg); // required gt0 and le 50
	this.isKey = (name, value, msg) => { // Required DB-key
		if (!value)
			return self.addRequired(name, msg);
		return (value > 0) ? self : self.addError(name, "notFound", msg);
	}

	// required and length <= max (Default max size == 1000)
	function fnSize(name, value, max, msg) {
		if (!value) // String length validations
			return !self.addRequired(name, msg);
		if (value.length > max)
			return !self.addError(name, "errMaxlength", msg);
		return true;
	}
	this.size = (name, value, msg, max) => { fnSize(name, value, max ?? 1000, msg); return self; }
	this.size20 = (name, value, msg) => { fnSize(name, value, 20, msg); return self; }
	this.size50 = (name, value, msg) => { fnSize(name, value, 50, msg); return self; }
	this.size100 = (name, value, msg) => { fnSize(name, value, 100, msg); return self; }
	this.size200 = (name, value, msg) => { fnSize(name, value, 200, msg); return self; }
	this.size250 = (name, value, msg) => { fnSize(name, value, 250, msg); return self; }
	this.size500 = (name, value, msg) => { fnSize(name, value, 500, msg); return self; }

	this.isEmail = (name, value, msg) => {
		if (!fnSize(name, value, 200, msg))
			return self; // size message error
		const ok = /\w+[^\s@]+@[^\s@]+\.[^\s@]+/.test(value); // RE_MAIL format
		return ok ? self : self.addError(name, "errCorreo", msg);
	}
	this.isLogin = (name, value, msg) => { // Loggin / Password / Code
		if (!fnSize(name, value, 200, msg))
			return self; // size message error
		if (value.length < 8)
			return self.addError(name, "errMinlength8", msg); // min length
		const ok = /^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{6,}$/.test(value); // RE_LOGIN format
		return ok ? self : self.addFormatError(name, msg);
	}

	this.word = (name, value, msg) => {
		if (!fnSize(name, value, 50, msg))
			return self; // size message error
		const ok = /\w+/.test(value); // RE_WORD format
		return ok ? self : self.addFormatError(name, msg);
	}
	this.words = (name, value, msg) => {
		if (!fnSize(name, value, 200, msg))
			return self; // size message error
		const ok = /^\w+(,\w+)*$/.test(value); // RE_WORDS format
		return ok ? self : self.addFormatError(name, msg);
	}
	this.digits = (name, value, msg) => {
		if (!fnSize(name, value, 20, msg))
			return self; // size message error
		const ok = /^[1-9]\d*$/.test(value); // RE_DIGITS format
		return ok ? self : self.addFormatError(name, msg);
	}
	this.numbers = (name, value, msg) => {
		if (!fnSize(name, value, 200, msg))
			return self; // size message error
		const ok = /^\d+(,\d+)*$/.test(value); // RE_NUMBERS format
		return ok ? self : self.addFormatError(name, msg);
	}

	// Date validations in string iso format (ej: "2022-05-11T12:05:01")
	function fnDate(name, value, msg) {
		if (!value) // iso date validation
			return !self.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\d/.test(value); // RE_DATE format
		return ok || !self.addDateError(name, msg);
	}
	this.isDate = (name, value, msg) => {
		fnDate(name, value, msg);
		return self;
	}
	this.isTime = (name, value, msg) => {
		if (!value) // iso date validation
			return self.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d:[0-5]\d(\.\d{1,3})?$/.test(value); // RE_TIME format
		return ok ? self : self.addDateError(name, msg);
	}
	this.isTimeShort = (name, value, msg) => {
		if (!value) // iso date validation
			return self.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d(:[0-5]\d\.\d{1,3})?$/.test(value); // RE_TIME format
		return ok ? self : self.addDateError(name, msg);
	}
	this.isDateTime = (name, value, msg) => {
		if (!value) // iso date validation
			return self.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}Z$/.test(value); // RE_DATE_TIME format
		return ok ? self : self.addDateError(name, msg);
	}
	this.past = (name, value, msg) => {
		if (!fnDate(name, value, msg))
			return self; // format message error
		if (value.substring(0, 19) > sysdate.substring(0, 19)) //yyyy-mm-ddThh:MM:ss
			return self.addError(name, "errDateLt", msg); // not in time
		return self;
	}
	this.leToday = (name, value, msg) => {
		if (!fnDate(name, value, msg))
			return self; // format message error
		if (value.substring(0, 10) > sysdate.substring(0, 10))
			return self.addError(name, "errDateLe", msg); // not in time
		return self;
	}
	this.geToday = (name, value, msg) => {
		if (!fnDate(name, value, msg))
			return self; // format message error
		if (value.substring(0, 10) < sysdate.substring(0, 10))
			return self.addError(name, "errDateGe", msg); // not in time
		return self;
	}

	this.generatePassword = (size, charSet) => {
		charSet = charSet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$";
		return Array.apply(null, Array(size || 10)).map(() => charSet.charAt(Math.random() * charSet.length)).join(""); 
	}
	this.testPassword = pass => { 
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
