
import sb from "./StringBox.js";

const fnParse = data => data && JSON.parse(data); //JSON parse
const fnReset = arr => { arr.splice(0, arr.length); return arr; }
const fnEachPrev = (arr, fn) => {
    let j = 0; // increment index
    for (let i = arr.length - 1; (i > -1); i--)
        fn(arr[i], i, j++);
    return arr;
}

export default class ArrayBox {
	size = sb.size;
	isEmpty = sb.isEmpty;
	parse = fnParse;
	split = sb.split;
	eachPrev = fnEachPrev;
	get = (arr, i) => arr ? arr[i] : null;
	last = arr => arr ? arr.last() : null;
	reset = arr => arr ? fnReset(arr) : [];
	at = (arr, index) => arr ? arr.at(index) : null;
	shuffle = arr => arr.sort(() => (0.5 - Math.random()));
	findIndex = (arr, fn) => arr ? arr.findIndex(fn) : -1;
	indexOf = (arr, value) => arr ? arr.indexOf(value) : -1;
	unique = arr => arr.filter((value, i) => (arr.indexOf(value) === i));
	distinct = (arr, fn) => arr.filter((o1, i) => (arr.findIndex(o2 => fn(o1, o2)) === i));

	multisort = (arr, fnSorts, dirs) => {
		dirs = dirs || []; // directions
		arr.sort((a, b) => {
			let result = 0; // compare result
        	for (let i = 0; (i < fnSorts.length) && (result == 0); i++) {
				const fn = fnSorts[i]; // cmp function = [-1, 0, 1]
				result = (dirs[i] == "desc") ? fn(b, a) : fn(a, b);
        	}
        	return result;
    	});
	}

	render = (data, fnRender, resume) => {
		const status = {};
		resume = resume || status;
		status.size = resume.size = data.length;
		return data.map((item, i) => { // render each item
			status.index = i;
			status.count = i + 1;
			return fnRender(item, status, resume, data);
		}).join("");
	}
}

// Mute JSON
JSON.size = sb.size;
JSON.read = fnParse;

// Extends Array prototype
Array.prototype.reset = function () { return fnReset(this); }
Array.prototype.eachPrev = function(fn) { return fnEachPrev(this, fn); }
Array.prototype.last = function() { return this.at(-1); }
