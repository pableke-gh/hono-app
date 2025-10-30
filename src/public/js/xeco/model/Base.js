
import i18n from '../../i18n/langs.js';

export default function() {
	const self = this; //self instance
	let _data; // current data container

	this.get = name => _data[name];
	this.set = (name, value) => { _data[name] = value; return self; }
	this.getData = () => _data;
	this.setData = data => { _data = data; return self; }
	this.getValue = name => {
		const fnValue = self[name]; // calculated value
		return fnValue ? fnValue() : self.get(name);
	}

	this.render = (template, opts) => i18n.render(template, self, opts);

	// Generc getters and setters
	this.getId = () => _data.id; // id de la instancia
	this.getNif = () => _data.usu; // nif del usuario de creacion
	this.getTipo = () => _data.tipo; // tipo de la insaancia
	this.setTipo = value => { _data.tipo = value; return self; }
	this.getSubtipo = () => _data.subtipo;
	this.setSubtipo = value => { _data.subtipo = value; return self; }
	this.getEstado = () => _data.estado;
	this.setEstado = value => { _data.estado = value; return self; }
	this.getMask = () => _data.mask;
	this.setMask = value => { _data.mask = value; return self; }
}
