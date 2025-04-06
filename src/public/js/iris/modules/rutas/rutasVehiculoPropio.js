
import iris from "../../model/Iris.js";
import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";
import i18n from "../../../i18n/langs.js";
import xeco from "../../../xeco/xeco.js";

function RutasVehiculoPropio() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	let _tblRutasVp; // itinerario

	this.getImporte = () => _tblRutasVp.getResume().impKm;
	this.render = () => { _tblRutasVp.render(rutas.getRutasVehiculoPropio()); return self; }

	const fnChangeKm = (data, el, tr) => {
		ruta.recalcKm(_tblRutasVp.getResume(), data, i18n.toFloat(el.value));
		tr.cells[9].innerText = i18n.isoFloat(ruta.getImpKm(data)) + " €";
		_tblRutasVp.renderFooter();
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
		_tblRutasVp = form.setTable("#tbl-rutas-vp");
		_tblRutasVp.setMsgEmpty("msgRutasEmpty")
				.setBeforeRender(ruta.beforeRender).setRender(ruta.rowVehiculoPropio).setFooter(ruta.tfootVehiculoPropio)
				.setAfterRender(fnAfterRenderVp).setChange("km1", fnChangeKm);

		const resume = _tblRutasVp.getResume();
		iris.getImpKm = () => resume.impKm;
		const fnJustifi = () => resume.justifi;
		form.set("is-rutas-vp", _tblRutasVp.size).set("is-justifi-km", fnJustifi);
		return self;
	}
}

export default new RutasVehiculoPropio();
