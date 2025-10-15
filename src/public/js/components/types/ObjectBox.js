
function ObjectBox() {
	const self = this; //self instance

	this.copy = function(output, data, keys) {
		if (keys)
			keys.forEach(key => { output[key] = data[key]; });
		else
			Object.assign(output, data);
		return output;
	}
	this.clone = (data, keys)  => self.copy({}, data, keys);
	this.values = (data, keys) => keys ? keys.map(key => data[key]) : Object.values(data);
	this.clear = (data, keys) => {
		if (keys)
			keys.forEach(key => delete data[key]);
		else {
			for (let key in data)
				delete data[key];
		}
		return data;
	}
	this.merge = (keys, values, data) => {
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

export default new ObjectBox();
