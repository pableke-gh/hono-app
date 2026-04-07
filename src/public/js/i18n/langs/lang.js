
import dt from "../../components/types/DateBox.js";
import nb from "../../components/types/NumberBox.js";

const RE_VAR = /[@$](\w+)(\.\w+)?;/g; // reg-exp for vars
const OPTS = { size: 1, index: 0 }; // default options

export default class Base {
	getData() { throw new Error("Method 'getData' must be implemented."); } // lang db
	get() { throw new Error("Method 'get' must be implemented."); } // direct access to lang data
	msg() { throw new Error("Method 'msg' must be implemented."); } // message value from key lang
	set() { throw new Error("Method 'set' must be implemented."); } // add new message
	getItem = (key, index) => this.get(key)[index]; // get message from index array
	confirm = msg => (msg ? confirm(this.get(msg)) : true); // if no param => true confirm
	boolval = str => (globalThis.isset(str) ? this.getItem("msgBool", str ? 1 : 0) : null);

	// Date formats
	enDate = str => str && str.substring(0, 10); //yyyy-mm-dd
	isoDate() { throw new Error("Method 'isoDate' must be implemented."); }
	strDate() { throw new Error("Method 'strDate' must be implemented."); }
	isoTime = str => str && str.substring(11, 19); //hh:MM:ss
	isoTimeShort = str => str && str.substring(11, 16); //hh:MM
	isoDateTime = str => this.isoDate(str) + " " + this.isoTime(str); //ISO date + hh:MM:ss

	// Float formats
	toFloat() { throw new Error("Method 'toFloat' must be implemented."); }
	floatval() { throw new Error("Method 'floatval' must be implemented."); }

	// Float to String formated
	isoFloat() { throw new Error("Method 'isoFloat' must be implemented."); }
	isoFloat1() { throw new Error("Method 'isoFloat1' must be implemented."); }
	isoFloat2() { throw new Error("Method 'isoFloat2' must be implemented."); }
	isoFloat3() { throw new Error("Method 'isoFloat3' must be implemented."); }

	// String to String formated (reformated)
	fmtFloat() { throw new Error("Method 'fmtFloat' must be implemented."); }
	fmtFloat1() { throw new Error("Method 'fmtFloat1' must be implemented."); }
	fmtFloat2() { throw new Error("Method 'fmtFloat2' must be implemented."); }
	fmtFloat3() { throw new Error("Method 'fmtFloat3' must be implemented."); }

	// Int formats
	toInt = nb.toInt; // String to Int instance
	intval = nb.intval; // String to navite integer
	isoInt() { throw new Error("Method 'isoInt' must be implemented."); } // Int to String formated
	fmtInt() { throw new Error("Method 'fmtInt' must be implemented."); } // String to String formated (reformated)

	// Render styled string
	render(str, data, opts) {
		opts = opts || OPTS;
		opts.size = opts.size || 1;
		opts.index = opts.index || 0;
		opts.count = opts.index + 1;
		opts.matches = opts.keys = 0;
		data = data || this.getData(); // default data = lang
		const fnValue = data.getValue || (k => (data[k]));
		return str.replace(RE_VAR, (m, k, t) => { // replacer
			opts.keys++; // always increment keys matches
			const value = fnValue(k) ?? this.get(k); // value to replace
			opts.matches += globalThis.isset(value); // increment matches
			if (m.startsWith("$")) // float / currency
				return this.isoFloat(value);
			if (t == ".d") // Object Date or Date in ISO string format
				return dt.isValid(value) ? this.strDate(value) : this.isoDate(value); // substring = 0, 10
			//if (globalThis.isFunc(value)) // function type
				//return value(opts); // call function
			return (value ?? opts[k] ?? ""); // Default = String
		});
	}
}
