
import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaVehiculoPropio.js";
import rutas from "../../model/ruta/Rutas.js";
import i18n from "../../i18n/langs.js";
import xeco from "../../../xeco/xeco.js";

function RutasVehiculoPropio() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblRutasVp = form.setTable("#tbl-rutas-vp", ruta.getTable()); // itinerario

	this.getImporte = () => _tblRutasVp.getResume().impKm;
	this.render = () => { _tblRutasVp.render(rutas.getRutasVehiculoPropio()); }

	const fnChangeKm = (data, el) => {
		data.km1 = i18n.toFloat(el.value);
		_tblRutasVp.refresh(); // update table
	}
	const fnAfterRenderVp = resume => {
		ruta.afterRender(resume);
		form.refresh(iris);
	}

	this.validate = data => {
		const resume = _tblRutasVp.getResume();
		const valid = form.getValidators();
		if (resume.justifi && !data.justifiKm) // justifi si distancia modificada al alza
			valid.addRequired("justifiKm", "Debe justificar la rectificación al alza del kilometraje.");
		return valid.isOk();
	}
	window.validateP6 = () => form.validate(self.validate);
 
	this.init = () => {
		const resume = _tblRutasVp.getResume();
		_tblRutasVp.setAfterRender(fnAfterRenderVp).setChange("km1", fnChangeKm);
		iris.getImpKm = () => resume.impKm;
		const fnJustifi = () => resume.justifi;
		form.set("is-rutas-vp", _tblRutasVp.size).set("is-justifi-km", fnJustifi);
	}
}

export default new RutasVehiculoPropio();
