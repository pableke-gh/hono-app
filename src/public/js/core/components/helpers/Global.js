
// Extends Object
Object.copy = (output, data, keys) => {
	if (keys)
		keys.forEach(key => { output[key] = data[key]; });
	else
		Object.assign(output, data);
	return output;
}
Object.clear = (data, keys) => {
	if (keys)
		keys.forEach(key => delete data[key]);
	else {
		for (let key in data)
			delete data[key];
	}
	return data;
}
Object.nestGroupBy = (arr, fields, i) => {
	i = i ?? 0; // current index of fields array
	if (i === fields.length) return arr; // skip
	const field = fields[i]; // current field to group by
	const grouped = Object.groupBy(arr, item => item[field]); // group by current field

	for (let key in grouped) // recursively call for each group with the remaining fields
		grouped[key] = Object.nestGroupBy(grouped[key], fields, i + 1); // next field to group by
	return grouped;
}

// Extends HTMLCollection prototype
HTMLCollection.prototype.map = Array.prototype.map;
HTMLCollection.prototype.some = Array.prototype.some;
HTMLCollection.prototype.find = Array.prototype.find;
HTMLCollection.prototype.filter = Array.prototype.filter;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.findIndex = Array.prototype.findIndex;
HTMLCollection.prototype.findLastIndex = Array.prototype.findLastIndex;

// Extends NodeList prototype
NodeList.prototype.map = Array.prototype.map;
NodeList.prototype.some = Array.prototype.some;
NodeList.prototype.find = Array.prototype.find;
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.findIndex = Array.prototype.findIndex;
NodeList.prototype.findLastIndex = Array.prototype.findLastIndex;

// Common global helpers
globalThis.void = () => {};
globalThis.isFunc = fn => (typeof fn === "function");
globalThis.isset = val => ((typeof val !== "undefined") && (val !== null));
globalThis.isObject = obj => ((typeof obj === "object") && (obj !== null) && !Array.isArray(obj));

export default globalThis;
