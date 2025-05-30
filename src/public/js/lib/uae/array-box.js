
function ArrayBox() {
	const self = this; //self instance
	const fnValue = (obj, name) => obj[name];
	const fnSize = arr => arr ? arr.length : 0; //string o array
	const isstr = val => (typeof(val) === "string") || (val instanceof String);

	// Extends Array prototype
	Array.prototype.update = function(fn) {
		for (let i = 0; i < this.length; i++)
			this[i] = fn(this[i], i); // Callback
		return this;
	}
	Array.prototype.remove = function(fn) {
		let i = this.findIndex(fn);
		(i < 0) || this.splice(i, 1);
		return this;
	}
	Array.prototype.swap = function(a, b) {
		let aux = this[a];
		this[a] = this[b];
		this[b] = aux;
		return this;
	}
	Array.prototype.stringify = function(separator, i, j) {
		i = i || 0; // Redefine join min/max limits
		j = (j < 0) ? (this.length + j) : (j || this.length);
		separator = separator ?? ","; // default = ","
		let output = (i < j) ? ("" + this[i++]) : "";
		while (i < j) // Iterate over array
			output += separator + this[i++];
		return output;
	}
	Array.prototype.format = function(tpl, opts) {
		opts = opts || {}; //default settings
		const empty = opts.empty || "";
		const fnVal = opts.getValue || fnValue;
		const status = { size: this.length };

		let output = ""; // Initialize result
		this.forEach((obj, i) => {
			status.index = i;
			status.count = i + 1;
			output += tpl.format((m, k) => {
				const fn = opts[k]; //field format function
				const value = fn ? fn(obj[k], obj, i) : (fnVal(obj, k) ?? status[k]);
				return value ?? empty; //string formated
			});
		})
		return output;
	}

	// Module functions
	this.size = fnSize;
	this.empty = arr => (fnSize(arr) < 1);
	this.swap = (arr, a, b) => { arr && arr.swap(a, b); return self; }
	this.mod = (arr, index) => arr ? arr[index % arr.length] : null;

	// Iterators
	this.each = function(arr, fn) {
		const size = fnSize(arr); //max
		for (let i = 0; i < size; i++)
			fn(arr[i], i, arr); //callback
		return self;
	}
	this.reverse = function(arr, fn) {
		for (let i = fnSize(arr) - 1; i > -1; i--)
			fn(arr[i], i, arr); //callback
		return self;
	}
	this.find = function(arr, fn) {
		const size = fnSize(arr); //max
		for (let i = 0; i < size; i++) {
			if (fn(arr[i], i, arr)) //callback
				return arr[i];
		}
		return null;
	}
	this.findIndex = function(arr, fn) {
		const size = fnSize(arr); //max
		for (let i = 0; i < size; i++) {
			if (fn(arr[i], i, arr)) //callback
				return i;
		}
		return -1;
	}
	this.every = function(arr, fn) {
		const size = fnSize(arr);
		for (var i = 0; i < size; i++)
			i = fn(arr[i], i) ? i : size;
		return (i == size);
	}

	//this.findLast = (arr, fn) => arr ? arr.findLast(fn) : null;
	//this.findLastIndex = (arr, fn) => arr ? arr.findLastIndex(fn) : -1;
	this.some = (arr, fn) => (self.findIndex(arr, fn) > -1);
	this.indexOf = (arr, elem) => arr ? arr.indexOf(elem) : -1;
	this.intersect = (a1, a2) => a2 ? a1.filter(e => (a2.indexOf(e) > -1)) : [];
	this.shuffle = arr => arr.sort(() => (0.5 - Math.random()));
	this.unique = (a1, a2) => a2 ? a1.concat(a2.filter(item => (a1.indexOf(item) < 0))) : a1;
	this.distinct = (arr, name) => name ? arr.filter((o1, i) => (arr.findIndex(o2 => (o1[name] === o2[name])) == i)) : arr;
	this.eq = (a1, a2) => a1 && a2 && a1.every((item, i) => (a2[i] == item));

	this.push = (arr, obj) => { arr && arr.push(obj); return self; }
	this.pop = arr => { arr && arr.pop(); return self; }
	this.remove = (arr, fn) => { arr && arr.remove(fn); return self; }
	this.reset = arr => { arr && arr.splice(0); return self; }
	this.get = (arr, i) => arr ? arr[i] : null;
	this.last = arr => self.get(arr, fnSize(arr) - 1);
	this.clone = arr => arr ? arr.slice() : [];

	// Sorting
	function fnCmp(a, b, fnSorts, dirs) {
		let result = 0; // compare result
		for (let i = 0; (i < fnSorts.length) && (result == 0); i++) {
			const fn = fnSorts[i]; // cmp function = [-1, 0, 1]
			result = (dirs[i] == "desc") ? fn(b, a) : fn(a, b);
		}
		return result;
	}
	this.sort = function(arr, dir, fnSort) {
		const fnDesc = (a, b) => fnSort(b, a);
		arr.sort((dir == "desc") ? fnDesc : fnSort);
		return self;
	}
	this.multisort = function(arr, fnSorts, dirs) {
		dirs = dirs || []; // directions
		arr.sort((a, b) => fnCmp(a, b, fnSorts, dirs));
		return self;
	}
	this.cmp = function(a, b, fnSorts, dirs) {
		return fnCmp(a, b, fnSorts, dirs || []);
	}

	// Objects helpers
	this.toObject = function(keys, values, data) {
		data = data || {}; // Output
		keys.forEach((k, i) => { data[k] = values[i]; });
		return data;
	}
	this.merge = this.toObject;
	this.copy = function(data, keys) {
		let result = {}; // Output
		keys.forEach(k => { result[k] = data[k]; });
		return result;
	}
	this.assign = this.copy;
	this.flush = function(data, keys) {
		let result = Object.assign({}, data);
		keys.forEach(k => { delete result[k]; });
		return result;
	}
	this.clean = this.flush;
	this.clear = function(obj) {
		for (let k in obj)
			delete obj[k];
		return obj;
	}

	// Serialization
	this.stringify = (data, separator, i, j) => data.stringify(separator, i, j);
	this.format = (data, tpl, opts) => data.format(tpl, opts);

	// Client helpers
	this.parse = (data, reviver) => data ? JSON.parse(data, reviver) : null;
	this.read = (name, reviver) => self.parse(window.sessionStorage.getItem(name), reviver);
	this.stringify = data => isstr(data) ? data : JSON.stringify(data);
	/*this.ss = function(name, data) {
		data && window.sessionStorage.setItem(name, self.stringify(data));
		return self;
	}
	this.ls = function(name, data) {
		data && window.localStorage.setItem(name, self.stringify(data));
		return self;
	}*/
}

export default new ArrayBox();
