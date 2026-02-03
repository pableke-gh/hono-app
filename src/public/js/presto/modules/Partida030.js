
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import presto from "../model/Presto.js";
import form from "../../xeco/modules/solicitud.js";

function Partida030() {
	const self = this; //self instance
	let _ej030;

	const acOrg030 = form.setAutocomplete("#acOrg030");
	const fnSource = term => api.init().json("/uae/presto/organicas/030", { ej: form.getval("#ej030"), term}).then(acOrg030.render);
	const fnSelect = item => form.setValue("#idEco030", item.imp);
	acOrg030.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelect);

	this.isLoaded = ej => (_ej030 == ej); // 030 cargado
	const fnLoad = partida => { // load tab 030
		_ej030 = partida.ej030 = partida.ej; // Ejercicio de la partida a añadir
		presto.getOrg080 = () => partida.o; // Organica del documento 080
		presto.getDescOrg080 = () => partida.dOrg; // Descripción de la organica del documento 080
		presto.getEco080 = () => partida.e; // Económica del documento 080
		presto.getDescEco080 = () => partida.dEco; // Descripción de la económica del documento 080
		presto.getImp080 = () => partida.imp; // Descripción de la económica del documento 080 

		form.setData(partida, ".ui-030").refresh(presto); // Actualizo los campos de la vista
		acOrg030.setValue(partida.idOrg030, partida.o030 + " - " + partida.dOrg030);
		tabs.showTab("030"); // change tab
	}
	this.view = partida => { // load tab 030
		if (self.isLoaded(partida.ej))
			return fnLoad(partida);
		// actualizo las economicas de ingresos 030 para el nuevo ejercicio
		const fnEconomicas = economicas => { form.setItems("#idEco030", economicas); fnLoad(partida); }
		api.init().json("/uae/presto/economicas/030?ej=" + partida.ej).then(fnEconomicas);
	}
	this.autoload = (partida, imp) => {
		if (!partida) // compruebo si existe partida a incrementar
			return !form.showError("Debe seleccionar una partida a incrementar");
		partida.imp = imp; //importe obligatorio
		partida.imp030 = partida.imp; // update imp 030
	}
}

export default new Partida030();
