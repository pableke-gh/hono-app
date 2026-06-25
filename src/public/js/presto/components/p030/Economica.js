
import DataList from "../../../core/components/forms/DataList.js";
import tabs from "../../../core/components/helpers/Tabs.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";

export default class Economica030 extends DataList {
	#ej030; // is tab preloaded

	setEditable() { this.setReadonly(!presto.isEditableUae()); }
	toFormData(fd) {} // not append values in form data

	isLoaded = ej => (this.#ej030 == ej); // 030 cargado
	showTab(partida) {
		this.#ej030 = partida.ej030 = partida.ej; // Ejercicio de la partida a añadir
		presto.getOrg080 = () => partida.o; // Organica del documento 080
		presto.getDescOrg080 = () => partida.dOrg; // Descripción de la organica del documento 080
		presto.getEco080 = () => partida.e; // Económica del documento 080
		presto.getDescEco080 = () => partida.dEco; // Descripción de la económica del documento 080
		presto.getImp080 = () => partida.imp; // Descripción de la económica del documento 080 

		this.form.update(partida, presto.isEditableUae(), ".ui-030"); // Actualizo los campos de la vista
		tabs.show("030"); // change tab
	}

	reload(partida, economicas) { // load options and refresh tab
		this.setItems(economicas).showTab(partida);
	}
}
