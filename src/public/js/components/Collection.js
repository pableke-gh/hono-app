
import ob from "./types/ObjectBox.js";
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

    this.copy = ob.copy;
	this.clone = ob.clone;
	this.values = ob.values;
	this.clear = ob.clear;
	this.merge = ob.merge;
}

// Client / Server global functions
globalThis.void = fnVoid;
globalThis.none = () => "";
globalThis.isset = isset;
globalThis.isObject = obj => (obj && (typeof obj === "object") && !Array.isArray(obj));
globalThis.catchError = promise => promise.then(data => [undefined, data]).catch(err => [err]);
globalThis.catchPromise = async fn => await globalThis.catchError(new Promise(fn));

// Mute JSON
JSON.size = sb.size;
JSON.read = fnParse;

// Extends Array prototype
Array.prototype.reset = function () { return fnReset(this); }
Array.prototype.eachPrev = function(fn) { return fnEachPrev(this, fn); }
Array.prototype.item = function(i) { return this[i % this.length]; }
Array.prototype.last = function() { return this.at(-1); }

export default new Collection();
