
import sb from "../../../components/types/StringBox.js";
import tabs from "../../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import iris from "../iris.js";
import perfil from "../perfil/perfil.js";
import maps from "./maps.js";
import rmun from "./rutasMun.js";
import rmaps from "./rutasMaps.js";

import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";

function Rutas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.setRutas = rutas => { rmaps.setRutas(rutas); return self; }
	this.update = rutas => { rutas && self.setRutas(rutas); return self; }

	this.validate = data => { // validaciones para los mapas
		let ok = rutas.validate(); // valida el itinerario
		if (ok && (rutas.size() < 2)) // validate min rutas = 2
			return !form.getValidators().addRequired("destino", "errMinRutas");
		return ok && rmaps.saveRutas(data); // guardo los cambios y recalculo las dietas
	}

	tabs.setAction("paso2", () => { form.validate(self.validate) && form.sendTab(window.rcPaso2); });
	tabs.setAction("save2", () => { form.validate(self.validate) && form.sendTab(window.rcSave2, "maps"); }); 

	async function fnAddRuta(ev) {
		ev.preventDefault(); // stop event
		const data = await maps.validate();
		if (!data) // maps validation
			return false;

		const temp = rutas.getRutas().concat(data);
		// reordeno todas las rutas por fecha de salida
		temp.sort((a, b) => sb.cmp(a.dt1, b.dt1));
		if (!rutas.validate(temp)) // check if all routes are valid
			return false; // no se agrega la nueva ruta
		if (ruta.isVehiculoPropio(data)) { // calcula distancia
			const dist = await maps.getDistance(data.origen, data.destino);
			data.km1 = data.km2 = dist; // actualiza las distancias
			if (!dist || i18n.getValidation().isError())
				return false; // invalid distance
		}

		// nuevo contenedor de rutas + recalculo de la ruta principal
		rmaps.setRutaPrincipal(rutas.setRutas(temp).findRutaPrincipal());
		return true; // ruta agregada correctamente
	}

	this.init = () => {
		rmun.init(); // formulario mun (paso 1)
		rmaps.init(); // formulario google maps (paso 2)
	}

	/*********** PERFIL MUN tab-1 ***********/ 
	tabs.setInitEvent(1, rmun.view); // formulario mun (paso 1)

	/*********** Google Maps API ***********/
	tabs.setActiveEvent("maps", perfil.isMaps);
	tabs.setInitEvent("maps", () => {
		maps.init(); // execute once on init tab
		form.setClick("#add-ruta", fnAddRuta)
			.setDateRange("#f1", "#f2").delAttr("#f1", "max") // Rango de fechas
			.onChangeInput("#f1", ev => form.setStrval("#f2", ev.target.value)) // copy value to f2
			.onChangeInput("#desp", ev => form.setVisible(".grupo-matricula", ev.target.value == "1"))
			.onChangeInput("#matricula", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
	});
}

export default new Rutas();
