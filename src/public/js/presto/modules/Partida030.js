
import tabs from "../../components/Tabs.js";
import i18n from "../../i18n/langs.js";

import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function Partida030() {
	const self = this; //self instance
    const form = xeco.getForm();
    const partida = presto.getPartida();
	let _ej030;

	const fnSource = () => window.rcFindOrg030();
	const fnSelect = item => form.setval("#idEco030", item.imp);
    const acOrg030 = form.setAcItems("#acOrg030", fnSource, fnSelect);

	//this.getForm = () => form;
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

	this.view = row => { // load tab view 3
		_ej030 = row.ej030 = row.ej; // Ejercicio de la partida a añadir
		presto.getOrg080 = () => row.o; // Organica del documento 080
		presto.getDescOrg080 = () => row.dOrg; // Descripción de la organica del documento 080
		presto.getEco080 = () => row.e; // Económica del documento 080
		presto.getDescEco080 = () => row.dEco; // Descripción de la económica del documento 080
		presto.getImp080 = () => row.imp; // Descripción de la económica del documento 080 
        form.setData(row, ".ui-030").refresh(presto); // Actualizo los campos de la vista
        acOrg030.setValue(row.idOrg030, row.o030 + " - " + row.dOrg030);
        tabs.showTab("030"); // change tab
        return self;
	}
	this.load = row => { // load tab view 3
		if (_ej030 == row.ej) // cambio de ejercicio
			return self.view(row); // cargo la vista
		window.rcEco030(); // actualizo las economicas 030
        return self;
	}

	this.autoload = (partida, imp) => {
		if (!partida) // compruebo si existe partida a incrementar
			return !form.showError("Debe seleccionar una partida a incrementar");
		partida.imp = imp; //importe obligatorio
		partida.imp030 = partida.imp; // update imp 030
		return true;
	}

	this.save = data => {
		partida.setData(data); // partida actual
		if (!form.validate(self.validate, ".ui-030")) // valida entrada
			return false; // Errores al validar el 030
		if (presto.isFinalizada())
			form.click("#save030"); // actualizo los datos a integrar
		else
			tabs.backTab().showOk("Datos del documento 030 asociados correctamente."); // Back to presto view
		return true;
	}
}

export default new Partida030();
