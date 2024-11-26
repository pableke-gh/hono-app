
import Msgs from "../msgs.js";
import { BankNames, IbanCodeLengths } from "../../data/banks.js";

// RegEx for Cards Numbers
/*const RE_VISA = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
const RE_MASTER_CARD = /^(?:5[1-5][0-9]{14})$/;
const RE_AMEX = /^(?:3[47][0-9]{13})$/;
const RE_DISCOVER = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
const RE_DINER_CLUB = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
const RE_JCB = /^(?:(?:2131|1800|35\d{3})\d{11})$/;*/

export default class Bancks extends Msgs {
	isIban(name, iban, msg) {
		let code = iban && iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
		if (!code || (iban.length !== IbanCodeLengths[code[1]]))
			return this.addRequired(name, msg);

		let digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, letter => (letter.charCodeAt(0) - 55));
		let digital = digits.toString();
		let checksum = digital.slice(0, 2);
		for (let offset = 2; offset < digital.length; offset += 7) {
			let fragment = checksum + digital.substring(offset, offset + 7);
			checksum = parseInt(fragment, 10) % 97;
		}
		return (checksum === 1) ? this : this.addError(name, "errFormat", msg);
	}
	isSwift(name, value, msg) {
		if (!value) // iso date validation
			return this.addRequired(name, msg); // required
		const ok = /^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$/.test(value); // RE_SWIFT / RE_BIC format
		return ok ? this : this.addFormatError(name, msg);
	}

	getEntidades() { return BankNames; }
	getIban1(iban) { return iban && iban.substring(0, 4); }
	getIban2(iban) { return iban && iban.substring(4, 8); }
	getEntidad(iban) { return BankNames[this.getIban2(iban)]; }
	getIban3(iban) { return iban && iban.substring(8, 12); }
	getOficina(iban) { return iban && iban.substring(8, 12); }
	getDC(iban) { return iban && iban.substring(12, 14); }

	isCreditCardNumber(name, cardNo, msg) { //Luhn check algorithm
		if (!cardNo || (cardNo.length != 16))
			return this.addRequired(name, msg);

		let s = 0;
		let doubleDigit = false;
		for (let i = 15; i >= 0; i--) {
			let digit = +cardNo[i];
			if (doubleDigit) {
				digit *= 2;
				digit -= (digit > 9) ? 9 : 0;
			}
			s += digit;
			doubleDigit = !doubleDigit;
		}
		return ((s % 10) == 0) ? this : this.addError(name, "errFormat", msg);
	}
}
