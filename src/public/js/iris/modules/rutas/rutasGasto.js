
import iris from "../iris.js";
import ruta from "../../model/ruta/RutaGasto.js";
import rutas from "../../model/ruta/Rutas.js";

function RutasGasto() {
	//const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblRutasGasto; // itinerario

	this.init = tab12 => {
		_tblRutasGasto = form.setTable("#rutas-out", ruta.getTable());

		// init. all validations and inputs events only once
		tab12.querySelector("a#gasto-rutas").onclick = ev => { // button in tab12
			const list = tab12.querySelectorAll(".link-ruta:checked").map(el => el.value).join(",");
			if (list)
				form.setStrval("#rutas-json", list).sendTab(window.rcUploadGasto, 5);
			else
				form.showError("errLinkRuta");
			ev.preventDefault();
		}
	}

	this.view = () => {
		_tblRutasGasto.render(rutas.getRutasUnlinked());
	}
}

export default new RutasGasto();
