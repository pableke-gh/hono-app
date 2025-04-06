
import tabs from "../../../components/Tabs.js";
import sb from "../../../components/types/StringBox.js";
import i18n from "../../../i18n/langs.js";

import iris from "../iris.js";
import perfil from "../perfil/perfil.js";
import maps from "./maps.js";
import rmun from "./rutasMun.js";
import rmaps from "./rutasMaps.js";
import rvp from "./rutasVehiculoPropio.js";

import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";

function Rutas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.setRutas = rutas => { rmaps.setRutas(rutas); return self; }
	this.update = rutas => { rutas && self.setRutas(rutas); return self; }

	this.validateP1 = data => {
		const valid = form.getValidators();
		if (!data.memo)
        	valid.addRequired("memo", "errObjeto");
		if (valid.isOk() && perfil.isMun()) // valida la ruta unica
			return rutas.validate() && rmaps.saveRutas();
		return valid.isOk();
	}
	this.validate = data => { // validaciones para los mapas
		let ok = self.validateP1(data) && rutas.validate();
		if (ok && (rutas.size() < 2)) // validate min rutas = 2
			return !form.getValidators().addRequired("destino", "errMinRutas");
		return ok && rmaps.saveRutas(); // guardo los cambios y recalculo las dietas
	}

	tabs.setAction("paso1", () => { form.validate(self.validateP1) && form.sendTab(window.rcPaso1); });
	tabs.setAction("save1", () => { form.validate(self.validateP1) && form.sendTab(window.rcSave1, 1); });
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
		rmaps.setRutaPrincipal(rutas.setRutas(temp).getRutaPrincipal());
		return true; // ruta agregada correctamente
	}

	this.maps = () => {
		maps.init(); // execute once
		form.setClick("#add-ruta", fnAddRuta).setDateRange("#f1", "#f2") // Rango de fechas
			.onChangeInput("#f1", ev => form.setval("#f2", ev.target.value)) // copy value to f2
			.onChangeInput("#desp", ev => form.setVisible(".grupo-matricula", ev.target.value == "1"))
			.onChangeInput("#matricula", ev => { ev.target.value = sb.toUpperWord(ev.target.value); });
		return self;
	}
	this.init = () => {
		rmaps.init();
		rvp.init();
	}

	/*********** PERFIL MUN tab-1 ***********/ 
	tabs.setInitEvent(1, rmun.init);

	/*********** Google Maps API ***********/
	tabs.setActiveEvent("maps", perfil.isMaps);
	tabs.setInitEvent("maps", self.maps);
	//tabs.setViewEvent("maps", tabs.resetToggleAction);
}

export default new Rutas();
