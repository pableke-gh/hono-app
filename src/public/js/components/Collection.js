
import ob from "./types/ObjectBox.js";
import ab from "./types/ArrayBox.js";

function Collection() {
	this.isset = ob.isset;
	this.isObject = ob.isObject;

	this.size = ab.size;
	this.isEmpty = ab.isEmpty;
	this.parse = ab.parse;
	this.split = ab.split;
	this.eachPrev = ab.eachPrev;

	this.at = ab.at;
	this.get = ab.get;
	this.last = ab.last;
	this.reset = ab.reset;
	this.shuffle = ab.shuffle;
	this.findIndex = ab.findIndex;
	this.indexOf = ab.indexOf;
	this.unique = ab.unique;
	this.distinct = ab.distinct;
    this.multisort = ab.multisort;
	this.render = ab.render;

    this.copy = ob.copy;
	this.clone = ob.clone;
	this.values = ob.values;
	this.clear = ob.clear;
	this.merge = ob.merge;
}

// Client / Server global functions
globalThis.void = () => {};
globalThis.none = () => "";
globalThis.isFunc = fn => (typeof fn === "function");
globalThis.catchError = promise => promise.then(data => [undefined, data]).catch(err => [err]);
globalThis.catchPromise = async fn => await globalThis.catchError(new Promise(fn));
export default new Collection();
