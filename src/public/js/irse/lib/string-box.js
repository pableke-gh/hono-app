
function StringBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const ESCAPE_HTML = /"|'|&|<|>|\\/g;
	const ESCAPE_MAP = { '"': "&#34;", "'": "&#39;", "&": "&#38;", "<": "&#60;", ">": "&#62;", "\\": "&#92;" };
	const TR1 = "àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ";
	const TR2 = "aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY";
	const sysdate = (new Date()).toISOString(); //global sysdate

	// Helpers
	function tr(str) {
		const size = fnSize(str);
		let output = str || EMPTY;
		for (let i = 0; i < size; i++) {
			let j = TR1.indexOf(str.charAt(i)); // is char remplazable
			output = (j < 0) ? output : output.replaceAt(TR2.charAt(j), i);
		}
		return output;
	}

	const fnLower = str => tr(str).toLowerCase(); // translate and lower
	const isset = val => (typeof(val) !== "undefined") && (val !== null);
	const isstr = val => (typeof(val) === "string") || (val instanceof String);
	const iiOf = (str1, str2) => fnLower(str1).indexOf(fnLower(str2));
	const fnWord = str => str.replace(/\W+/g, EMPTY); //remove no alfanum
	const fnSize = str => str ? str.length : 0; //string o array

	// Extends String prototype
	String.prototype.insert = function(str, i) {
		return this.substring(0, i) + str + this.substring(i);
	}
	String.prototype.replaceAt = function(str, i) {
		return this.substring(0, i) + str + this.substring(i + str.length);
	}
	String.prototype.wrap = function(str, open, close) {
		if (str) {
			const i = iiOf(this, str);
			const j = i + str.length;
			return (i < 0) ? this : (this.substring(0, i) + (open || "<u><b>") + this.substring(i, j) + (close || "</b></u>") + this.substring(j));
		}
		return this;
	}
	String.prototype.remove = function(i, n) {
		return this.substring(0, i) + this.substring(i + n);
	}
	String.prototype.format = function(fn) {
		return this.replace(/@(\w+);/g, fn);
	}
	String.prototype.render = function(data, opts) {
		opts = opts || {}; //default settings
		const empty = opts.empty || EMPTY;
		const fnVal = opts.getValue || self.val;
		const fnFinish = opts.onFinish || ((matches, output) => (matches ? output : EMPTY));

		let matches = 0; //counter
		let output = this.format((m, k) => {
			const fn = opts[k]; //field format function
			let value = fn ? fn(data[k], data) : fnVal(data, k);
			matches += isset(value) ? 1 : 0; //replaced?
			return value ?? empty; //string formated
		});
		return fnFinish(matches, output);
	}

	// Module functions
	this.isset = isset;
	this.isstr = isstr;
	this.size = fnSize;
	this.trLower = fnLower;
	this.trUpper = str => tr(str).toUpperCase();
	this.lower = str => str ? str.toLowerCase(str) : str;
	this.upper = str => str ? str.toUpperCase(str) : str;
	this.substr = (str, i, n) => str ? str.substr(i, n) : str;
	this.substring = (str, i, j) => str ? str.substring(i, j) : str;
	this.indexOf = (str1, str2) => str1 ? str1.indexOf(str2) : -1;
	this.lastIndexOf = (str1, str2) => str1 ? str1.lastIndexOf(str2) : -1;
	this.prevIndexOf = (str1, str2, i) => str1 ? str1.substr(0, i).lastIndexOf(str2) : -1;
	this.starts = (str1, str2) => str1 && str1.startsWith(str2);
	this.ends = (str1, str2) => str1 && str1.endsWith(str2);
	this.prefix = (str1, str2) => self.starts(str1, str2) ? str1 : (str2 + str1);
	this.suffix = (str1, str2) => self.ends(str1, str2) ? str1 : (str1 + str2);
	this.trunc = (str, size) => (fnSize(str) > size) ? (str.substr(0, size).trim() + "...") : str;
	this.trim = str => str ? str.trim() : str;

	this.escape = str => str && str.replace(ESCAPE_HTML, matched => ESCAPE_MAP[matched]);
	this.unescape = str => str && str.replace(/&#(\d+);/g, (key, num) => String.fromCharCode(num));

	this.iwrap = (str1, str2, open, close) => str1 && str1.wrap(str2, open, close);
	this.rand = size => Math.random().toString(36).substr(2, size || 8); //random char
	this.lopd = str => str && ("***" + str.substr(3, 4) + "**"); //hide protect chars

	//chunk string in multiple parts
	this.test = (str, re) => (str && re.test(str)) ? str : null;
	this.split = (str, sep) => str ? str.trim().split(sep) : [];
	this.match = (str, re) => str ? str.trim().match(re) : [];
	this.lastId = str => +self.match(str, /\d+$/).pop();
	this.chunk = (str, size) => self.match(str, new RegExp(".{1," + size + "}", "g"));
	this.slices = function(str, sizes) {
		const result = []; //parts container
		const k = fnSize(str); //maxlength
		var j = 0; //string position
		for (let i = 0; (j < k) && (i < sizes.length); i++) {
			let n = sizes[i];
			result.push(str.substr(j, n));
			j += n;
		}
		(j < k) && result.push(str.substr(j));
		return result;
	}

	// Date iso string handlers (ej: "2022-05-11T12:05:01")
	const fnEnDate = str=> str.substring(0, 10); //yyyy-mm-dd
	const fnEsDate = str => str.substring(8, 10) + "/" + str.substring(5, 7) + "/" + str.substring(0, 4); //dd/mm/yyyy
	const fnIsoTime = str => str.substring(11, 19); //hh:MM:ss

	this.sysdate = () => sysdate;
	this.toDate = str => str ? new Date(str) : null;
	this.isDate = str => /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d[\.\d{1,3}]?$/.test(str);
	this.enDate = str => str && fnEnDate(str); //yyyy-mm-dd
	this.esDate = str => str && fnEsDate(str); //dd/mm/yyyy
	this.minTime = str => self.substring(str, 11, 16); //hh:MM
	this.isoTime = str => str && fnIsoTime(str); //hh:MM:ss
	this.isoEnDateTime = str => str && (fnEnDate(str) + " " + fnIsoTime(str)); //yyyy-mm-dd hh:MM:ss
	this.isoEsDateTime = str => str && (fnEsDate(str) + " " + fnIsoTime(str)); //dd/mm/yyyy hh:MM:ss
	this.diffDate = (str1, str2) => (Date.parse(str1) - Date.parse(str2));
	/*this.toIsoDate = (date, time) => (date + "T" + self.toIsoTime(time) + ".0");
	this.toIsoTime = str => {
		const size = fnSize(str);
		if (size == 0) // no time
			return "00:00:00"; //hh:MM:ss
		return (size < 6) ? (str + ":00") : str;
	}*/

	this.inYear = (str1, str2) => self.substring(str1, 0, 4) == self.substring(str2, 0, 4);
	this.inMonth = (str1, str2) => self.substring(str1, 0, 7) == self.substring(str2, 0, 7);
	this.inDay = (str1, str2) => self.substring(str1, 0, 10) == self.substring(str2, 0, 10);
	this.inHour = (str1, str2) => self.substring(str1, 0, 13) == self.substring(str2, 0, 13);
	this.startDay = str => str ? (fnEnDate(str) + "T00:00:00.0") : str;
	this.endDay = str => str ? (fnEnDate(str) + "T23:59:59.999") : str;
	this.getDate = str => +self.substring(str, 8, 10); // Get day as integer
	this.getHours = str => +self.substring(str, 14, 16); // Get hours as integer
	this.geToday = str => self.inDay(str, sysdate) || (str > sysdate);
	this.future = str => (str > sysdate);
	this.past = str => (str < sysdate);
	/****************** End Date helpers ******************/

	this.minify = str => str ? str.trim().replace(/\s+/g, " ") : str;
	this.toWord = str => str ? fnWord(str) : str;
	this.toUpperWord = str => str ? fnWord(str).toUpperCase() : str;
	this.lines = str => self.split(str, /[\n\r]+/);
	this.words = str => self.split(str, /\s+/);

	this.between = function(value, min, max) { // value into a range
		min = min || value;
		max = max || value;
		return (min <= value) && (value <= max);
	}
	this.cmp = function(a, b) {
		if (isset(a) && isset(b))
			return ((a < b) ? -1 : ((a > b) ? 1 : 0));
		return isset(a) ? -1 : 1; //nulls last
	}

	this.cmpBy = (a, b, name) => self.cmp(a[name], b[name]); // compare objects prop.
	this.eq = (str1, str2) => (fnLower(str1) == fnLower(str2)); // insensitive equal
	this.ilike = (str1, str2) => (iiOf(str1, str2) > -1); // insensitive like
	this.olike = (obj, names, val) => names.some(name => self.ilike(obj[name], val));
	this.alike = (obj, names, val) => self.words(val).some(v => self.olike(obj, names, v));
	this.multilike = (obj, filter, names) => names.every(name => self.ilike(obj[name], filter[name]));
	this.multicmp = names => names.map(name => ((a, b) => self.cmp(a[name], b[name]))); // map => cmp functions
	this.in = (value, min, max) => value ? self.between(value, min, max) : true; // Open range filter

	this.val = (obj, name) => obj[name]; // Default access prop (ES)
	this.enVal = (obj, name) => obj[name + "_en"] || obj[name]; // EN access prop
	this.format = (data, tpl, opts) => tpl.render(data, opts);
	this.render = (data, tpl, opts) => tpl.render(data, opts);
	/*this.entries = function(data, tpl, opts) {
		opts = opts || {}; //default settings
		const fnVal = opts.getValue || self.val;

		let output = EMPTY; //result buffer
		for (const k in data) {
			const fn = opts[k]; //field format function
			const value = fn ? fn(data[k], data) : fnVal(data, k);
			output += tpl.replace("@key;", k).replace("@value;", value);
		}
		return output;
	}*/
}

export default new StringBox();
