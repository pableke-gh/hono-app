
function TemporalBox() {
	const self = this; //self instance

	this.parse = str => Temporal.PlainDate.from(str);
	this.trunc = date => date.set({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

	this.cmp = (f1, f2) => Temporal.PlainDate.compare(f1, f2);
	this.gt = (f1, f2) => (self.cmp(f1, f2) > 0);
	this.ge = (f1, f2) => (self.cmp(f1, f2) >= 0);
	this.lt = (f1, f2) => (self.cmp(f1, f2) < 0);
	this.le = (f1, f2) => (self.cmp(f1, f2) <= 0);
	this.isBetween = (date, minDate, endDate) => {
		return (self.le(minDate, date) && self.ge(endDate, date));
	}
}

export default new TemporalBox();
