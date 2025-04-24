
import Msgs from "./msgs.js";
import banks from "./validators/banks.js";
import personId from "./validators/personId.js";

// RegEx for validating
/*const RE_IPv4 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
const RE_IPv6 = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
const RE_URL = /(http|fttextp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;*/

export default function validators(lang) {
	const msgs = new Msgs(lang); // messages container
	const sysdate = (new Date()).toISOString();

	const _personId = personId(msgs);
	const _banks = banks(msgs);

	// read only instance validators
	msgs.getPersonId = () => _personId;
	msgs.getBanks = () => _banks;

	msgs.gt = (name, value, min, msgtip, msg) => { // required gt min
		if (!globalThis.isset(value))
			return msgs.addRequired(name, msg); // required
		return (value > min) ? msgs : msgs.addError(name, msgtip || "notAllowed", msg); 
	}
	msgs.gt1 = (name, value, msgtip, msg) => msgs.gt(name, value, 1, msgtip, msg); // required gt1
	msgs.gt0 = (name, value, msg) => msgs.gt(name, value, 0, "errGt0", msg); // required gt0
	msgs.ge = (name, value, min, msgtip, msg) => (!value || (value >= min)) ? msgs : msgs.addError(name, msgtip, msg); // optional or ge min
	msgs.ge1 = (name, value, msgtip, msg) => msgs.ge(name, value, 1, msgtip, msg); // optional or ge1
	msgs.ge0 = (name, value, msg) => msgs.ge(name, value, 0, "errGt0", msg); // optional or ge0
	msgs.max = (name, value, max, msg) => (!value || (value.length <= max)) ? msgs : msgs.addError(name, "errMaxlength", msg); // optional or length <= max 

	msgs.le = (name, value, max, msgtip, msg) => { // required gt0 and le max
		if (!globalThis.isset(value))
			return msgs.addRequired(name, msg);
		return ((value > 0) && (value <= max)) ? msgs : msgs.addError(name, msgtip || "notAllowed", msg);
	}
	msgs.le10 = (name, value, msgtip, msg) => msgs.le(name, value, 10, msgtip, msg); // required gt0 and le 10
	msgs.le20 = (name, value, msgtip, msg) => msgs.le(name, value, 20, msgtip, msg); // required gt0 and le 20
	msgs.le25 = (name, value, msgtip, msg) => msgs.le(name, value, 25, msgtip, msg); // required gt0 and le 25
	msgs.le50 = (name, value, msgtip, msg) => msgs.le(name, value, 50, msgtip, msg); // required gt0 and le 50
	msgs.isKey = (name, value, msg) => { // Required DB-key
		if (!value)
			return msgs.addRequired(name, msg);
		return (value > 0) ? msgs : msgs.addError(name, "notFound", msg);
	}

	// required and length <= max (Default max size == 1000)
	function fnSize(name, value, max, msg) {
		if (!value) // String length validations
			return !msgs.addRequired(name, msg);
		if (value.length > max)
			return !msgs.addError(name, "errMaxlength", msg);
		return true;
	}
	msgs.size = (name, value, msg, max) => { fnSize(name, value, max ?? 1000, msg); return msgs; }
	msgs.size20 = (name, value, msg) => { fnSize(name, value, 20, msg); return msgs; }
	msgs.size50 = (name, value, msg) => { fnSize(name, value, 50, msg); return msgs; }
	msgs.size100 = (name, value, msg) => { fnSize(name, value, 100, msg); return msgs; }
	msgs.size200 = (name, value, msg) => { fnSize(name, value, 200, msg); return msgs; }
	msgs.size250 = (name, value, msg) => { fnSize(name, value, 250, msg); return msgs; }
	msgs.size500 = (name, value, msg) => { fnSize(name, value, 500, msg); return msgs; }

	msgs.isEmail = (name, value, msg) => {
		if (!fnSize(name, value, 200, msg))
			return msgs; // size message error
		const ok = /\w+[^\s@]+@[^\s@]+\.[^\s@]+/.test(value); // RE_MAIL format
		return ok ? msgs : msgs.addError(name, "errCorreo", msg);
	}
	msgs.isLogin = (name, value, msg) => { // Loggin / Password / Code
		if (!fnSize(name, value, 200, msg))
			return msgs; // size message error
		if (value.length < 8)
			return msgs.addError(name, "errMinlength8", msg); // min length
		const ok = /^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{6,}$/.test(value); // RE_LOGIN format
		return ok ? msgs : msgs.addFormatError(name, msg);
	}

	msgs.word = (name, value, msg) => {
		if (!fnSize(name, value, 50, msg))
			return msgs; // size message error
		const ok = /\w+/.test(value); // RE_WORD format
		return ok ? msgs : msgs.addFormatError(name, msg);
	}
	msgs.words = (name, value, msg) => {
		if (!fnSize(name, value, 200, msg))
			return msgs; // size message error
		const ok = /^\w+(,\w+)*$/.test(value); // RE_WORDS format
		return ok ? msgs : msgs.addFormatError(name, msg);
	}
	msgs.digits = (name, value, msg) => {
		if (!fnSize(name, value, 20, msg))
			return msgs; // size message error
		const ok = /^[1-9]\d*$/.test(value); // RE_DIGITS format
		return ok ? msgs : msgs.addFormatError(name, msg);
	}
	msgs.numbers = (name, value, msg) => {
		if (!fnSize(name, value, 200, msg))
			return msgs; // size message error
		const ok = /^\d+(,\d+)*$/.test(value); // RE_NUMBERS format
		return ok ? msgs : msgs.addFormatError(name, msg);
	}

	// Date validations in string iso format (ej: "2022-05-11T12:05:01")
	function fnDate(name, value, msg) {
		if (!value) // iso date validation
			return !msgs.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\d/.test(value); // RE_DATE format
		return ok || !msgs.addDateError(name, msg);
	}
	msgs.isDate = (name, value, msg) => {
		fnDate(name, value, msg);
		return msgs;
	}
	msgs.isTime = (name, value, msg) => {
		if (!value) // iso date validation
			return msgs.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d:[0-5]\d(\.\d{1,3})?$/.test(value); // RE_TIME format
		return ok ? msgs : msgs.addDateError(name, msg);
	}
	msgs.isTimeShort = (name, value, msg) => {
		if (!value) // iso date validation
			return msgs.addRequired(name, msg); // required
		const ok = /[0-2]\d:[0-5]\d(:[0-5]\d\.\d{1,3})?$/.test(value); // RE_TIME format
		return ok ? msgs : msgs.addDateError(name, msg);
	}
	msgs.isDateTime = (name, value, msg) => {
		if (!value) // iso date validation
			return msgs.addRequired(name, msg); // required
		const ok = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{1,3}Z$/.test(value); // RE_DATE_TIME format
		return ok ? msgs : msgs.addDateError(name, msg);
	}
	msgs.past = (name, value, msg) => {
		if (!fnDate(name, value, msg))
			return msgs; // format message error
		if (value.substring(0, 19) > sysdate.substring(0, 19)) //yyyy-mm-ddThh:MM:ss
			return msgs.addError(name, "errDateLt", msg); // not in time
		return msgs;
	}
	msgs.leToday = (name, value, msg) => {
		if (!fnDate(name, value, msg))
			return msgs; // format message error
		if (value.substring(0, 10) > sysdate.substring(0, 10))
			return msgs.addError(name, "errDateLe", msg); // not in time
		return msgs;
	}
	msgs.geToday = (name, value, msg) => {
		if (!fnDate(name, value, msg))
			return msgs; // format message error
		if (value.substring(0, 10) < sysdate.substring(0, 10))
			return msgs.addError(name, "errDateGe", msg); // not in time
		return msgs;
	}

	msgs.generatePassword = (size, charSet) => {
		charSet = charSet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$";
		return Array.apply(null, Array(size || 10)).map(() => charSet.charAt(Math.random() * charSet.length)).join(""); 
	}
	msgs.testPassword = pass => { 
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

	return msgs;
}
