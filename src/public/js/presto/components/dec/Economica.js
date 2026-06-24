
import api from "../../../core/components/Api.js";
import DataList from "../../../core/components/forms/DataList.js";
import presto from "../../model/Presto.js";

export default class EconomicaDec extends DataList {
	select = () => { // override final arrow function
		if (this.isEmpty()) // if empty only clear fields
			return this.form.setValue("imp").setValue("cd");

		const item = this.getCurrent();
		const org = this.form.getValue("orgDec");
		if (presto.isL83() && presto.isEditable()) //L83 => busco su AIP solo en edicion
			api.init().json(`/uae/presto/l83?org=${org}`).then(data => this.form.getPartidas().setL83(data, item.imp));
		else if (presto.isAnt() && presto.isEditable()) //ANT => cargo misma organica solo en edicion
			api.init().json(`/uae/presto/anticipo?org=${org}&eco=${item.value}`).then(data => this.form.getPartidas().setAnt(data));
		this.form.setValue("cd", item.imp); // set importe
	}

	load(data) { this.setOption(data.ecoDec, data.ecoDecDesc); } // cargo el desplegable de economicas
	setEditable() { return this.setReadonly(!presto.isEditable()); }

	reset() {
		this.form.setValue("imp").setValue("cd");
		return super.reset();
	}

	reload = economicas => {
		this.setItems(economicas).select();
	}

	connectedCallback() { // init. component
		this.setEmptyOption("lblSelectEco").addChange(this.select);
	}
}
