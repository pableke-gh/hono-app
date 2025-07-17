
export default function() {
	const self = this; //self instance
	let _data; // current data container

	this.getData = () => _data;
	this.get = name => _data[name];
	this.getValue = name => {
		const fnValue = self[name]; // calculated value
		return fnValue ? fnValue() : self.get(name);
	}

	this.init = globalThis.void; // init. data after setData
	this.setData = data => { _data = data; self.init(data); return self; }

	this.set = (name, value) => { _data[name] = value; return self; }
	this.setValue = (name, value) => {
		const fnValue = self["set" + name.charAt(0).toUpperCase() + name.slice(1)];
		return fnValue ? fnValue(value) : self.set(name, value); // set value
	}

	// Generc getters and setters
	this.getId = () => _data.id;
	this.getTipo = () => _data.tipo;
	this.setTipo = value => { _data.tipo = value; return self; }
	this.getSubtipo = () => _data.subtipo;
	this.setSubtipo = value => { _data.subtipo = value; return self; }
	this.getEstado = () => _data.estado;
	this.setEstado = value => { _data.estado = value; return self; }
	this.getMask = () => _data.mask;
	this.setMask = value => { _data.mask = value; return self; }
}
