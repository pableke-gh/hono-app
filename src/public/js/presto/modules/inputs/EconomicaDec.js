
import DataList from "../../../components/inputs/DataList.js";
import api from "../../../components/Api.js";

import presto from "../../model/Presto.js";
import form from "../presto.js";

export default class EconomicaDec extends DataList {
	select = () => { // override final arrow function
		if (this.isEmpty()) // if empty only clear fields
			return form.setValue("imp").setValue("cd");

		const item = this.getCurrent();
		const pInc = form.getPartidaInc();
		const org = form.getValue("orgDec");
		//const _autoloadErr = msg => { this.#organica.isItem() && form.showError(msg); }
		const _autoloadL83 = data => { data ? pInc.autoload(data, item.imp) : form.showError("Aplicación AIP no encontrada en el sistema."); }
		const _autoloadAnt = data => { data ? pInc.autoload(data, Math.max(0, data.ih)) : form.showError("No se ha encontrado el anticipo en el sistema."); }

		form.setValue("cd", item.imp); // set importe
		if (presto.isL83() && presto.isEditable()) //L83 => busco su AIP solo en edicion
			return api.init().json(`/uae/presto/l83?org=${org}`).then(_autoloadL83);
		if (presto.isAnt() && presto.isEditable()) //ANT => cargo misma organica solo en edicion
			return api.init().json(`/uae/presto/anticipo?org=${org}&eco=${item.value}`).then(_autoloadAnt);
	}

	load(data) {
		this.setOption(data.ecoDec, data.ecoDecDesc); // cargo el desplegable de economicas
	}

	reload = economicas => {
		this.setItems(economicas).select();
	}

	connectedCallback() { // init. component
		this.setEmptyOption("Seleccione una económica").addChange(this.select);
	}
}
