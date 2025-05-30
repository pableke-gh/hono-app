
import sb from "./types/StringBox.js";

const fnVoid = () => {}
const fnParse = data => data && JSON.parse(data); //JSON parse
const isset = val => ((typeof(val) !== "undefined") && (val !== null));

function fnReset(arr) {
    arr.splice(0, arr.length);
    return arr;
}
function fnEachPrev(arr, fn) {
    let j = 0; // increment index
    for (let i = arr.length - 1; (i > -1); i--)
        fn(arr[i], i, j++);
    return arr;
}

function Collection() {
	const self = this; //self instance

	this.isset = isset;
	this.size = sb.size;
	this.isEmpty = sb.isEmpty;
	this.parse = fnParse;
	this.split = sb.split;
	this.eachPrev = fnEachPrev;
	this.get = (arr, i) => arr ? arr[i] : null;
	this.last = arr => arr ? arr.last() : null;
	this.reset = arr => arr ? fnReset(arr) : [];
	this.shuffle = arr => arr.sort(() => (0.5 - Math.random()));
	this.findIndex = (arr, fn) => arr ? arr.findIndex(fn) : -1;
	this.indexOf = (arr, value) => arr ? arr.indexOf(value) : -1;
	this.unique = arr => arr.filter((value, i) => (arr.indexOf(value) === i));
	this.distinct = (arr, fn) => arr.filter((o1, i) => (arr.findIndex(o2 => fn(o1, o2)) === i));

	/*this.remove = (arr, fn) => {
		let i = self.findIndex(arr, fn);
		(i < 0) || this.splice(i, 1);
		return self;
	}*/

    this.multisort = function(arr, fnSorts, dirs) {
		dirs = dirs || []; // directions
		arr.sort((a, b) => {
            let result = 0; // compare result
            for (let i = 0; (i < fnSorts.length) && (result == 0); i++) {
                const fn = fnSorts[i]; // cmp function = [-1, 0, 1]
                result = (dirs[i] == "desc") ? fn(b, a) : fn(a, b);
            }
            return result;
        });
		return self;
	}

	this.render = (data, fnRender, resume) => {
		const status = {};
		resume = resume || status;
		status.size = resume.size = data.length;
		return data.map((item, i) => { // render each item
			status.index = i;
			status.count = i + 1;
			return fnRender(item, status, resume, data);
		}).join("");
	}

    this.copy = function(output, data, keys) {
		if (keys)
			keys.forEach(key => { output[key] = data[key]; });
		else
			Object.assign(output, data);
		return output;
	}
	this.clone = (data, keys)  => self.copy({}, data, keys);
	this.values = (data, keys) => keys ? keys.map(key => data[key]) : Object.values(data);
	this.clear = function(data, keys) {
		if (keys)
			keys.forEach(key => delete data[key]);
		else {
			for (let key in data)
				delete data[key];
		}
		return data;
	}
	this.merge = function(keys, values, data) {
		data = data || {}; // Output
		keys.forEach((k, i) => { data[k] = values[i]; });
		return data;
	}

	// Extends Object
	Object.copy = self.copy;
	Object.clone = self.clone;
	Object.clear = self.clear;
	Object.merge = self.merge;
	Object.extract = self.values;
}

// Client / Server global functions
globalThis.void = fnVoid;
globalThis.isset = isset;
globalThis.none = () => "";
globalThis.catchError = promise => promise.then(data => [undefined, data]).catch(err => [err]);
globalThis.catchPromise = fn => globalThis.catchError(new Promise(fn));

// Mute JSON
JSON.size = sb.size;
JSON.read = fnParse;

// Extends Array prototype
Array.prototype.reset = function () { return fnReset(this); }
Array.prototype.eachPrev = function(fn) { return fnEachPrev(this, fn); }
Array.prototype.item = function(i) { return this[i % this.length]; }
Array.prototype.last = function() { return this.at(-1); }

export default new Collection();
