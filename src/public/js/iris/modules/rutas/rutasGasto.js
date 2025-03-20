
import tabs from "../../../components/Tabs.js";
import iris from "../iris.js";
import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";

function RutasGasto() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblRutasGasto; // itinerario

	this.initTab12 = tab12 => {
		_tblRutasGasto = form.setTable("#rutas-out");
		_tblRutasGasto.setMsgEmpty("msgRutasEmpty").setRender(ruta.rowRutasGasto).setFooter(ruta.tfootRutasGasto); 

		// init. all validations and inputs events only once
		tab12.querySelector("a#gasto-rutas").onclick = ev => { // button in tab12
			const list = tab12.querySelectorAll(".link-ruta:checked").map(el => el.value).join(",");
			if (list)
				form.setStrval("#rutas-json", list).click("#uploadGasto");
			else
				form.showError("errLinkRuta");
			ev.preventDefault();
		}
	}
	this.view = () => {
		_tblRutasGasto.render(rutas.getRutasSinGastos());
	}

	// update tabs events
	tabs.setInitEvent(12, self.initTab12);
	tabs.setViewEvent(12, self.view);
}

export default new RutasGasto();
