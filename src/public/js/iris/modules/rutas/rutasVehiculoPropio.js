
import iris from "../iris.js";
import resumen from "../resumen.js";
import ruta from "../../model/ruta/Ruta.js";
import i18n from "../../../i18n/langs.js";

function RutasVehiculoPropio() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblRutasVp; // itinerario

	this.getImporte = () => _tblRutasVp.getResume().impKm;

	const fnChangeKm = (data, el, tr) => {
		ruta.recalcKm(_tblRutasVp.getResume(), data, i18n.toFloat(el.value));
		tr.cells[9].innerText = i18n.isoFloat(ruta.getImpKm(data)) + " €";
		_tblRutasVp.renderFooter();
	}
	const fnAfterRenderVp = resume => {
		ruta.afterRender(resume);
		resumen.upodate();
		form.setVisible("#justifi-km", resume.justifi)
			.setVisible(".rutas-vp", resume.size > 0)
			.text("#imp-km", i18n.isoFloat(resume.impKm) + " €");
	}

	this.validate = data => {
		const resume = _tblRutasVp.getResume();
		const valid = form.getValidators();
		if (resume.justifi && !data.justifiKm) // justifi si distancia modificada al alza
			valid.addRequired("justifiKm", "Debe justificar la rectificación al alza del kilometraje.");
		return valid.isOk();
	}
	window.validateP6 = () => form.validate(self.validate);

	this.setRutas = rutas	=> {
		_tblRutasVp.render(rutas);
		return self;
	}

	this.init = () => {
		_tblRutasVp = form.setTable("#tbl-rutas-vp");
		_tblRutasVp.setMsgEmpty("msgRutasEmpty")
				.setBeforeRender(ruta.beforeRender).setRender(ruta.rowVehiculoPropio).setFooter(ruta.tfootVehiculoPropio)
				.setAfterRender(fnAfterRenderVp).setChange("km1", fnChangeKm);
		return self;
	}
}

export default new RutasVehiculoPropio();
