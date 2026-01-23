
const isset = val => ((typeof val !== "undefined") && (val !== null));
const isObject = obj => ((typeof obj === "object") && !Array.isArray(obj));

// Extends Object
Object.copy = (output, data, keys) => {
	if (keys)
		keys.forEach(key => { output[key] = data[key]; });
	else
		Object.assign(output, data);
	return output;
};
Object.clone = (data, keys)  => this.copy({}, data, keys);
Object.clear = (data, keys) => {
	if (keys)
		keys.forEach(key => delete data[key]);
	else {
		for (let key in data)
			delete data[key];
	}
	return data;
}
Object.merge = (keys, values, data) => {
	data = data || {}; // Output
	keys.forEach((k, i) => { data[k] = values[i]; });
	return data;
}

class ObjectBox {
	isset = isset;
	isObject = isObject;

	copy = Object.copy;
	clone = Object.clone;
	values = (data, keys) => keys ? keys.map(key => data[key]) : Object.values(data);
	clear = Object.clear;
	merge = Object.merge;
}

// Client / Server global functions
globalThis.isset = isset;
globalThis.isObject = isObject;

export default new ObjectBox();
