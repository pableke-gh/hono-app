
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";

import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function Partida030() {
	const self = this; //self instance
	const form = xeco.getForm();
	const partida = presto.getPartida();
	let _ej030;

	const acOrg030 = form.setAutocomplete("#acOrg030");
	const fnSource = term => api.init().json(`/uae/presto/organicas/dec?ej=${form.getval("#ej030")}&term=${term}`).then(acOrg030.render);
	const fnSelect = item => form.setValue("#idEco030", item.imp);
	acOrg030.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelect);

	this.validate = data030 => {
		const data = partida.getData();
		const valid = i18n.getValidators();
		if (!data) // Debo cargar previamente la partida seleccionada
			return !valid.setError("No se ha encontrado la partida asociada al documento 080.");
		const ERR_ORGANICA = "No ha seleccionado correctamente la orgánica";
		valid.isKey("acOrg030", data030.idOrg030, ERR_ORGANICA); // autocomplete required key
		valid.isKey("idEco030", data030.idEco030, "Debe seleccionar una económica"); // select required number
		valid.gt0("imp030", data030.imp030); // float number > 0
		const label = data030.acOrg030?.split(" - ");
		if (!label) // Code separator
			return !valid.addError("acOrg030", ERR_ORGANICA, "No ha seleccionada correctamente la aplicación para el DC 030.");
		if (data.imp < data030.imp030)
			return !valid.addError("imp030", "errExceeded", "El importe del documento 030 excede al del 080.");

		// If ok => update partida a incrementar
		data.idOrg030 = +data030.idOrg030;
		[ data.o030, data.dOrg030 ] = label;
		data.idEco030 = data030.idEco030;
		data.imp030 = data030.imp030;
		return valid.isOk();
	}

	this.isLoaded = ej => (_ej030 == ej); // 030 cargado
	this.view = partida => { // load tab 030
		if (!self.isLoaded(partida.ej)) {
			// actualizo las economicas de ingresos 030 para el nuevo ejercicio
			const fnEconomicas = economicas => form.setItems("#idEco030", economicas);
			api.init().json("/uae/presto/economicas/030?ej=" + partida.ej).then(fnEconomicas);
		}
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
	this.autoload = (partida, imp) => {
		if (!partida) // compruebo si existe partida a incrementar
			return !form.showError("Debe seleccionar una partida a incrementar");
		partida.imp = imp; //importe obligatorio
		partida.imp030 = partida.imp; // update imp 030
	}
}

export default new Partida030();
