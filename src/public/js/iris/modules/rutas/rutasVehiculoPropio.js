
import Table from "../../../components/Table.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaVehiculoPropio.js";
import rutas from "../../model/ruta/Rutas.js";
import form from "../../../xeco/modules/SolicitudForm.js";

class RutasVehiculoPropio extends Table {
	constructor() {
		super(form.querySelector("#tbl-rutas-vp"), ruta.getTable());
	}

	getImporte = () => this.getProp("impKm");
	isJustifiKm = () => this.getProp("justifi");
	// super keyword simulation for arrow function
	render = () => Table.prototype.render.call(this, rutas.getRutasVehiculoPropio());

	validate = data => {
		const valid = i18n.getValidators();
		const resume = this.getResume();
		if (resume.justifi) // justifi si distancia modificada al alza
			valid.size("justifiKm", data.justifiKm, "errJustifiKm");
		return valid.isOk();
	}

	init = () => {
		form.set("is-rutas-vp", this.size).set("is-justifi-km", this.isJustifiKm);
		this.setAfterRender(resume => {
			ruta.afterRender(resume);
			form.refresh(iris);
		});
		this.setChange("km1", (data, el) => {
			data.km1 = i18n.toFloat(el.value);
			refresh(); // update table
		});
	}
}

export default new RutasVehiculoPropio();
