
function fnLetraDni(value) { // private function
	const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
	const letra = letras.charAt(parseInt(value, 10) % 23);
	return (letra == value.charAt(8));
}

export default function personId(msgs) {
	msgs.isDni = (name, value) => {  
		if (!value)
			return msgs.addRequired(name);
		if (!/^(\d{8})([A-Z])$/.test(value) || !fnLetraDni(value)) // RE_DNI
			return msgs.addError(name, "errNif");
		return msgs;
	}

	msgs.isCif = (name, value) => {
		if (!value)
			return msgs.addRequired(name);
		const match = value.match(/^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/); // RE_CIF
		if (!match || (match.length < 2))
			return msgs.addError(name, "errNif");

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
		return ok ? msgs : msgs.addError(name, "errNif");
	}

	msgs.isNie = (name, value) => {
		if (!value) // RE_NIE = /^[XYZ]\d{7,8}[A-Z]$/;
			return msgs.addRequired(name);
		const prefix = value.charAt(0); //Change the initial letter for the corresponding number and validate as DNI
		let p0 = (prefix == "X") ? 0 : ((prefix == "Y") ? 1 : ((prefix == "Z") ? 2 : prefix));
		return fnLetraDni(p0 + value.substr(1)) ? msgs : msgs.addError(name, "errNif");
	}

	msgs.isPersonId = (name, value) => {
		if (msgs.isDni(name, value).isOk())
			return msgs;
		if (msgs.isCif(name, value).isOk())
			return msgs;
		return msgs.isNie(name, value);
	}

	return msgs;
}
