
import Msgs from "../msgs.js";

function fnLetraDni(value) { // private function
	const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
	const letra = letras.charAt(parseInt(value, 10) % 23);
	return (letra == value.charAt(8));
}

export default function PersonId(lang) {
	const self = this; //self instance
	const msgs = new Msgs(lang); // messages container

	this.isOk = msgs.isOk;
	this.isError = msgs.isError;
	this.getMsgs = msgs.getMsgs;

	this.reset = () => { msgs.reset(); return self; }
	this.addError = (name, msgtip, msg) => { msgs.addError(name, msgtip, msg); return self; }
	this.addRequired = (name, msg) => { msgs.addRequired(name, msg); return self; }

	this.isDni = (name, value) => {  
		if (!value)
			return self.addRequired(name);
		if (!/^(\d{8})([A-Z])$/.test(value) || !fnLetraDni(value)) // RE_DNI
			return self.addError(name, "errNif");
		return self;
	}

	this.isCif = (name, value) => {
		if (!value)
			return self.addRequired(name);
		const match = value.match(/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/); // RE_CIF
		if (!match || (match.length < 2))
			return self.addError(name, "errNif");

		var letter = match[1];
		var number  = match[2];
		var control = match[3];
		var sum = 0;

		for (let i = 0; i < number.length; i++) {
			let n = parseInt(number[i], 10);
			//Odd positions (Even index equals to odd position. i=0 equals first position)
			if ((i % 2) === 0) {
				n *= 2; //Odd positions are multiplied first
				// If the multiplication is bigger than 10 we need to adjust
				n = (n < 10) ? n : (parseInt(n / 10) + (n % 10));
			}
			sum += n;
		}

		sum %= 10;
		var control_digit = (sum !== 0) ? 10 - sum : sum;
		var control_letter = "JABCDEFGHI".substr(control_digit, 1);
		var ok = letter.match(/[ABEH]/) ? (control == control_digit) //Control must be a digit
								: letter.match(/[KPQS]/) ? (control == control_letter) //Control must be a letter
								: ((control == control_digit) || (control == control_letter)); //Can be either
		return ok ? self : self.addError(name, "errNif");
	}

	this.isNie = (name, value) => {
		if (!value) // RE_NIE = /^[XYZ]\d{7,8}[A-Z]$/;
			return self.addRequired(name);
		const prefix = value.charAt(0); //Change the initial letter for the corresponding number and validate as DNI
		let p0 = (prefix == "X") ? 0 : ((prefix == "Y") ? 1 : ((prefix == "Z") ? 2 : prefix));
		return fnLetraDni(p0 + value.substr(1)) ? self : self.addError(name, "errNif");
	}

	this.isPersonId = (name, value) => {
		if (self.isDni(name, value).isOk())
			return self;
		if (self.isCif(name, value).isOk())
			return self;
		return self.isNie(name, value);
	}
}
