
import tabs from "../../../components/Tabs.js";
import iris from "../iris.js";
import rutas from "./rutas.js";
import ruta from "../../model/ruta/Ruta.js";

function RutasReadOnly() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblReadOnly; // itinerario
	let _renderRutasRead; // bool indicator

	this.setRender = () => { _renderRutasRead = true; }

	this.view = () => {
		if (!_tblReadOnly) {
			_tblReadOnly = form.setTable("#rutas-read");
			_tblReadOnly.setMsgEmpty("msgRutasEmpty").setBeforeRender(ruta.beforeRender).setRender(ruta.rowReadOnly).setFooter(ruta.tfoot);
		}
		if (_renderRutasRead)
			_tblReadOnly.render(rutas.getRutas());
		_renderRutasRead = false;
	}

	// update tabs events
	tabs.setAction("show-rutas-read", self.view);
}

export default new RutasReadOnly();
