
function StringBox() {
	const self = this; //self instance
	const EMPTY = ""; // empty string type
    const sysdate = (new Date()).toISOString(); //global sysdate
	const ESCAPE_HTML = /"|'|&|<|>|\\/g;
	const ESCAPE_MAP = { '"': "&#34;", "'": "&#39;", "&": "&#38;", "<": "&#60;", ">": "&#62;", "\\": "&#92;" };
	
	const fnSize = data => (data ? data.length : 0); // usfull for string o array
	const fnNormalize = str => str.normalize("NFD").replace(/\p{Diacritic}/gu, EMPTY);
	const fnLower = str => (str ? fnNormalize(str).toLowerCase() : EMPTY); // normalize and lower
	const fnWord = str => str.replace(/\W+/g, EMPTY); // remove all no alfanum characters
	const isstr = val => (typeof(val) === "string") || (val instanceof String);
	const insertAt = (str1, str2, i) => str1.substring(0, i) + str2 + str1.substring(i);
	const replaceAt = (str1, str2, i) => str1.substring(0, i) + str2 + str1.substring(i + str2.length);
	
	this.isstr = isstr;
	globalThis.isstr = isstr;

	this.size = fnSize;
    this.insertAt = insertAt;
    this.replaceAt = replaceAt;
	this.isEmpty = str => (fnSize(str) < 1); // length > 0

    this.unescape = str => str ? str.replace(/&#(\d+);/g, (key, num) => String.fromCharCode(num)) : null;
    this.escape = str => str ? str.trim().replace(ESCAPE_HTML, (matched) => ESCAPE_MAP[matched]) : null;

	this.substr = (str, i, n) => str ? str.substr(i, n) : str;
	this.substring = (str, i, j) => str ? str.substring(i, j) : str;

    this.iIndexOf = (str1, str2) => fnLower(str1).indexOf(fnLower(str2)); // insensitive index
    this.ilike = (str1, str2) => (self.iIndexOf(str1, str2) > -1); // insensitive search
	this.eq = (str1, str2) => (fnLower(str1) == fnLower(str2)); // insensitive equal
	this.normalize = str => str ? fnNormalize(str) : str; // standar

	this.lower = str => str ? str.toLowerCase(str) : str;
	this.upper = str => str ? str.toUpperCase(str) : str;
    this.starts = (str1, str2) => str1 && str1.startsWith(str2);
	this.ends = (str1, str2) => str1 && str1.endsWith(str2);
	this.prefix = (str1, str2) => self.starts(str1, str2) ? str1 : (str2 + str1);
	this.suffix = (str1, str2) => self.ends(str1, str2) ? str1 : (str1 + str2);
	this.trunc = (str, size) => (fnSize(str) > size) ? (str.substr(0, size).trim() + "...") : str;

	this.clean = str => str ? str.replace(/\s+/g, EMPTY) : str;
	this.minify = str => str ? str.trim().replace(/\s+/g, " ") : str;
    this.trim = str => str ? str.trim() : str;
    this.ltrim = (str, sep) => str ? str.replace(new RegExp("^" + sep + "+"), EMPTY) : str;
    this.rtrim = (str, sep) => str ? str.replace(new RegExp(sep + "+$"), EMPTY) : str;
    this.wrap = (str1, str2, open, close) => {
        open = open || "<u><b>"; // open tag indicator
        const i = self.iIndexOf(str1, str2); // Use extended insensitive search
        return (i < 0) ? str1 : insertAt(insertAt(str1, open, i), close || "</b></u>", i + str2.length + open.length);
    }

    // Random values
	this.rand = size => Math.random().toString(36).substring(2, 2 + (size || 8));
	this.randFloat = (min, max) => Math.random() * ((max || 1e9) - min) + min;
	this.randInt = (min, max) => Math.floor(self.randFloat(min || 0, max));
    this.randString = (size, characters) => { // Declare all characters
        characters = characters || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let result = EMPTY;
        for (let i = 0; i < size; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

	// String Datetime handlers
	this.sysdate = () => sysdate;
	this.toDate = str => str ? new Date(str) : null; // Build new Date instance
	this.inYear = (str1, str2) => self.starts(str1, self.substring(str2 || sysdate, 0, 4)); //yyyy
	this.inMonth = (str1, str2) => self.starts(str1, self.substring(str2 || sysdate, 0, 7)); //yyyy-mm
	this.inDay = (str1, str2) => self.starts(str1, self.substring(str2 || sysdate, 0, 10)); //yyyy-mm-dd
	this.inHour = (str1, str2) => self.starts(str1, self.substring(str2 || sysdate, 0, 13)); //yyyy-mm-ddThh
	this.diffDate = (str1, str2) => (Date.parse(str1) - Date.parse(str2 || sysdate)); // get timestamp 
	this.isoDate = str => str && str.substring(0, 10); //yyyy-mm-dd
	this.strDate = str => str ? str.substring(0, 10) : EMPTY; //yyyy-mm-dd
	this.isoTime = str => str && str.substring(11, 19); //hh:MM:ss
	this.isoTimeShort = str => str && str.substring(11, 16); //hh:MM
	this.strTimeShort = str => str ? str.substring(11, 16) : EMPTY; //hh:MM
	this.toIsoTime = str => str ? (str + ":00") : "00:00:00"; //hh:MM:ss
	this.toIsoDate = (date, time) => (date + "T" + self.toIsoTime(time) + ".0Z"); //yyyy-mm-ddThh:MM:ss
	this.getYear = str => (str || sysdate).substring(0, 4); // yyyy string format
	this.getHours = str => +(str || sysdate).substring(11, 13); // hh number format [0-23]
	this.getMonth = str => +(str || sysdate).substring(5, 7); // mm number format [1-12]
	this.getMinutes = str => +(str || sysdate).substring(14, 16); // min number format [0-59]
	this.endDay = str => str ? (str.substring(0, 10) + "T23:59:59.999Z") : str;
	this.cmp = function(a, b) {
		if (globalThis.isset(a) && globalThis.isset(b))
			return ((a < b) ? -1 : ((a > b) ? 1 : 0));
		return globalThis.isset(a) ? -1 : 1; //nulls last
	}
	this.getEjercicios = num => {
		let year = +self.getYear(); // current year
		num = year - (num ?? 6); // default 6 years
		const ejercicios = []; // array of years (container)
		while (year > num) // iterate from current year to num
			ejercicios.push(year--); // add year to array
		return ejercicios; // return array of years
	}

	// Chunk string in multiple parts
	this.test = (str, re) => re.test(str) ? str : null;
	this.split = (str, sep) => str ? str.split(sep || ",") : [];
	this.match = (str, re) => str ? str.trim().match(re) : null;
	this.lastId = str => +self.match(str, /\d+$/).pop();
	this.chunk = (str, size) => str ? str.trim().match(str, new RegExp(".{1," + size + "}", "g")) : null;
	this.lpad = (str, size, pad) => str ? str.padStart(size, pad) : null;

    // Modificators
	this.lopd = str => str && ("***" + str.substr(3, 4) + "**"); //hide protect chars
    this.getCode = (str, sep) => str && str.substring(0, str.indexOf(sep || " "));
	this.toCode = str => str ? fnWord(str).toUpperCase() : str;
	this.toWord = str => str ? fnWord(str) : str;
	this.toUpperWord = str => str ? fnWord(str).toUpperCase() : str;
	this.lines = str => self.split(str, /[\n\r]+/);
	this.words = str => self.split(str, /\s+/);
}

export default new StringBox();
