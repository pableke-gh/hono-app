
import iris from "../iris.js";
import ruta from "../../model/ruta/Ruta.js";
import i18n from "../../../i18n/langs.js";

function RutasVehiculoPropio() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblRutasVp; // itinerario

	const fnChangeKm = (data, el, tr) => {
		ruta.recalcKm(_tblRutasVp.getResume(), data, i18n.toFloat(el.value));
		tr.cells[9].innerText = i18n.isoFloat(ruta.getImpKm(data)) + " €";
		_tblRutasVp.renderFooter();
	}
	const fnAfterRenderVp = resume => {
		ruta.afterRender(resume);
		form.setVisible("#justifi-km", resume.justifi)
			.setText("#imp-km", i18n.isoFloat(resume.impKm) + " €");
	}

	this.render = rutas	=> {
		_tblRutasVp.render(rutas);
		return self;
	}

	this.init = () => {
		_tblRutasVp = form.setTable("#vp");
		_tblRutasVp.setMsgEmpty("msgRutasEmpty")
				.setBeforeRender(ruta.beforeRender).setRender(ruta.rowVehiculoPropio).setFooter(ruta.tfootVehiculoPropio)
				.setAfterRender(fnAfterRenderVp).setChange("km1", fnChangeKm);
		return self;
	}
}

export default new RutasVehiculoPropio();
