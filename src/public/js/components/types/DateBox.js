
const ONE_DAY = 86400000; //1d = 24 * 60 * 60 * 1000 = hours*minutes*seconds*milliseconds
const daysInMonths = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]; //january..december

//const lpad = val => (val < 10) ? ("0" + val) : val; //always 2 digits
const isDate = date => date && date.getTime && !isNaN(date.getTime()); // full date validator
const isLeapYear = year => ((year & 3) == 0) && (((year % 25) != 0) || ((year & 15) == 0)); //año bisiesto?
const daysInMonth = (y, m) => daysInMonths[m] + ((m == 1) && isLeapYear(y));

function DateBox() {
	const self = this; //self instance
	const sysdate = new Date(); //global sysdate readonly

	this.isValid = isDate;
	this.sysdate = () => sysdate;
	this.toDate = str => str ? new Date(str) : null;
	this.getTime = date => date ? date.getTime() : Date.now();
	// Changes the Date object, and returns its new timestamp. If timeValue is NaN => Invalid Date
	this.setTime = (date, time) => (date || sysdate).setTime(time || Date.now());

	this.clone = date => new Date(self.getTime(date));
	this.isLeap = date => isLeapYear((date || sysdate).getFullYear());
	this.daysInMonth = date => date ? daysInMonth(date.getFullYear(), date.getMonth()) : 0;

	// Date to String
	this.isoDate = date => date.toISOString().substring(0, 10); //yyyy-mm-dd
    this.isoTime = date => date.toISOString().substring(11, 19); //hh:MM:ss
    this.isoTimeShort = date => date.toISOString().substring(11, 16); //hh:MM

	const lpad = val => ((val < 10) ? ("0" + val) : val); // always 2 digits
	this.toPlainDate = date => (date.getFullYear() + "-" + lpad(date.getMonth() + 1) + "-" + lpad(date.getDate())); //yyyy-mm-dd
	this.toPlainDateTime = date => (self.toPlainDate(date) + " " + date.toLocaleTimeString()); //yyyy-mm-dd hh:MM:ss

	// Randoms
	this.randTime = (d1, d2) => Math.floor(Math.random() * self.diffDate(d2, d1) + d1.getTime());
	this.randDate = (d1, d2) => new Date(self.randTime(d1, d2));
	this.rand = () => self.randDate(new Date(sysdate.getTime() - (ONE_DAY*30)), sysdate);

	// Date transformations
	this.trunc = date => { date && date.setHours(0, 0, 0, 0); return date; } // set time to 00:00:00.000
	this.addHours = (date, hours) => { date && date.addHours(hours); return date; } // add hours to date
	this.addDays = (date, days) => { date && date.addDays(days); return date; } // add days to date
	this.addYears = (date, years) => { date && date.setFullYear(date.getFullYear() + years); return date; } // add years to date

	// Equality operators == != === !== cannot be used to compare (the value of) dates
	const _le = (d1, d2) => (d1.getTime() <= d2.getTime()); // less than or equal
	this.le = (d1, d2) => (isDate(d1) && isDate(d2) && _le(d1, d2)); // d1 less than or equal to d2
	this.lt = (d1, d2) => (isDate(d1) && isDate(d2) && (d1.getTime() < d2.getTime()));
	this.eq = (d1, d2) => (isDate(d1) && isDate(d2) && (d1.getTime() == d2.getTime()));
	this.gt = (d1, d2) => (isDate(d1) && isDate(d2) && (d1.getTime() > d2.getTime()));
	this.ge = (d1, d2) => (isDate(d1) && isDate(d2) && (d1.getTime() >= d2.getTime()));
	this.inRange = (date, min, max) => (_le(min, date) && (!max || _le(date, max))); // date in range [min, max]
	this.between = self.inRange; // synonym for inRange function
	this.diffDate = (d1, d2) => (d1.getTime() - d2.getTime()); // time difference in milliseconds (ej: 1737749220000)
	this.getDays = (d1, d2) => (self.diffDate(d1, d2) / ONE_DAY); // Num of days between to dates (float value, ej: 4.25)
	this.diffDays = (d1, d2) => Math.floor(self.getDays(d1, d2)); // Num of complete days between to dates (int value, ej: 4)
	this.cmp = function(d1, d2) {
		if (d1 && d2)
			return self.diffDate(d1, d2);
		return d1 ? -1 : 1; //nulls last
	}

	this.getYear = date => (date || sysdate).getFullYear(); // yyyy number format
	this.getHours = date => (date || sysdate).getHours(); // hh number format [0-23]
	this.getMonth = date => (date || sysdate).getMonth(); // mm number format [0-11]
	this.getMinutes = date => (date || sysdate).getMinutes(); // min number format [0-59]

	this.inYear = (d1, d2) => isDate(d1) && isDate(d2) && (d1.getFullYear() == d2.getFullYear());
	this.inMonth = (d1, d2) => self.inYear(d1, d2) && (d1.getMonth() == d2.getMonth());
	this.inDay = (d1, d2) => self.inMonth(d1, d2) && (d1.getDate() == d2.getDate());
	this.inHour = (d1, d2) => self.inDay(d1, d2) && (d1.getHours() == d2.getHours());
	this.geToday = date => self.inDay(date, sysdate) || self.ge(date, sysdate);
	this.future = date => self.gt(date, sysdate);
	this.past = date => self.lt(date, sysdate);

	// Extends Date prototype
	Date.prototype.addHours = function(hours) { this.setHours(this.getHours() + hours); return this; }
	Date.prototype.addDays = function(days) { this.setDate(this.getDate() + days); return this; }
	Date.prototype.diffDays = function(date) { return self.diffDays(this, date); }
}

export default new DateBox();
