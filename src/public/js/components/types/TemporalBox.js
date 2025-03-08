
//import { Temporal } from "@js-temporal/polyfill";

function TemporalBox() {
	const self = this; //self instance
	//const sysdate = Temporal.Now.plainDateTimeISO();

	this.now = () => Temporal.Now.plainDateTimeISO();
	this.parse = str => Temporal.PlainDateTime.from(str);
	this.trunc = date => { date.set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }); return self; }
	this.clone = date => (date ? self.parse(date) : self.now());

	this.addMonths = (date, months) => { date.add({ months }); return self; }
	this.addDays = (date, days) => { date.add({ days }); return self; }
	this.addHours = (date, hours) => { date.add({ hours }); return self; }
	this.addMinutes = (date, minutes) => { date.add({ minutes }); return self; }

	this.cmp = (f1, f2) => Temporal.PlainDate.compare(f1, f2);
	this.gt = (f1, f2) => (self.cmp(f1, f2) > 0);
	this.ge = (f1, f2) => (self.cmp(f1, f2) >= 0);
	this.lt = (f1, f2) => (self.cmp(f1, f2) < 0);
	this.le = (f1, f2) => (self.cmp(f1, f2) <= 0);
	this.isBetween = (date, minDate, endDate) => {
		return (self.le(minDate, date) && self.ge(endDate, date));
	}

	this.getHours = (f1, f2) => f1.since(f2).hours;
	this.getDays = (f1, f2) => f1.until(f2, { largestUnit: "day" }).days;
}

export default new TemporalBox();
