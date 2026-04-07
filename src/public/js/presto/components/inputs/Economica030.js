
import DataList from "../../../components/inputs/DataList.js";
import tabs from "../../../components/Tabs.js";

import presto from "../../model/Presto.js";
import form from "../../modules/presto.js";

export default class Economica030 extends DataList {
	#ej030; // is tab preloaded

	isLoaded = ej => (this.#ej030 == ej); // 030 cargado
	showTab(partida) {
		this.#ej030 = partida.ej030 = partida.ej; // Ejercicio de la partida a añadir
		presto.getOrg080 = () => partida.o; // Organica del documento 080
		presto.getDescOrg080 = () => partida.dOrg; // Descripción de la organica del documento 080
		presto.getEco080 = () => partida.e; // Económica del documento 080
		presto.getDescEco080 = () => partida.dEco; // Descripción de la económica del documento 080
		presto.getImp080 = () => partida.imp; // Descripción de la económica del documento 080 

		form.setData(partida, ".ui-030").refresh(presto); // Actualizo los campos de la vista
		tabs.show("030"); // change tab
	}

	reload(partida, economicas) { // load options and refresh tab
		this.setItems(economicas).showTab(partida);
	}
}
