
import ob from "./types/ObjectBox.js";
import ArrayBox from "./types/ArrayBox.js";

// Client / Server global functions
globalThis.void = () => {};
globalThis.none = () => "";
globalThis.isFunc = fn => (typeof fn === "function");

class Collection extends ArrayBox {
	isset = ob.isset;
	isObject = ob.isObject;

	copy = ob.copy;
	clone = ob.clone;
	values = ob.values;
	clear = ob.clear;
	merge = ob.merge;
}

export default new Collection();
