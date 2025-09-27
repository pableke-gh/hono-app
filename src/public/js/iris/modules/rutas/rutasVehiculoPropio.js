
import i18n from "../../i18n/langs.js";
import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/RutaVehiculoPropio.js";
import rutas from "../../model/ruta/Rutas.js";
import xeco from "../../../xeco/xeco.js";

function RutasVehiculoPropio() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblRutasVp = form.setTable("#tbl-rutas-vp", ruta.getTable()); // itinerario

	this.getImporte = () => _tblRutasVp.getProp("impKm");
	this.isJustifiKm = () => _tblRutasVp.getProp("justifi");
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
		const valid = form.getValidators();
		const resume = _tblRutasVp.getResume();
		if (resume.justifi) // justifi si distancia modificada al alza
			valid.size("justifiKm", data.justifiKm, "errJustifiKm");
		return valid.isOk();
	}
 
	this.init = () => {
		_tblRutasVp.setAfterRender(fnAfterRenderVp).setChange("km1", fnChangeKm);
		form.set("is-rutas-vp", _tblRutasVp.size).set("is-justifi-km", self.isJustifiKm);
	}
}

export default new RutasVehiculoPropio();
