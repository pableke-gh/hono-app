
import ruta from "../../model/ruta/RutaReadOnly.js";
import rutas from "../../model/ruta/Rutas.js";
import iris from "../iris.js";

function RutasReadOnly() {
	const form = iris.getForm(); // form component
	let _tblReadOnly; // itinerario

	this.setRender = () => {
		_tblReadOnly && _tblReadOnly.setChanged(true);
	}

	this.view = () => {
		if (!_tblReadOnly)
			_tblReadOnly = form.setTable("#rutas-read", ruta.getTable()).setChanged(true);
		if (_tblReadOnly.isChanged()) // render only if data has changed
			_tblReadOnly.render(rutas.getRutas()).setChanged();
	}
}

export default new RutasReadOnly();
