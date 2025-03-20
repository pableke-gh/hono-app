
import sb from "../../../components/types/StringBox.js";
import iris from "../iris.js";
import resumen from "../resumen.js";
import rro from "./rutasReadOnly.js";
import ruta from "../../model/ruta/Ruta.js";
import rutas from "../../model/ruta/Rutas.js";
import { CT } from "../../data/rutas.js";

function RutasMaps() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblRutas; // itinerario
	let _saveRutas; // bool indicator

	this.getRutas = rutas.getRutas;
	this.size = rutas.size;
	this.isEmpty = rutas.isEmpty;
	this.setSaveRutas = () => { _saveRutas = true; }

	this.getSalida = rutas.getSalida;
	this.getLlegada = rutas.getLlegada;
	this.getKm = () => _tblRutas.getResume().totKm;

	this.getNumRutasSinGastos = rutas.getNumRutasSinGastos;
	this.getRutaPrincipal = rutas.getRutaPrincipal;
	this.setRutaPrincipal = data => {
		rutas.setRutaPrincipal(data);
		_tblRutas.render(rutas.getRutas());
		return self;
	}

	const fnUpdateView = () => {
		form.setVisible(".rutas-gt-1", self.size() > 1); 
		_saveRutas = false;
		return self;
	}
	this.reload = data => {
		rutas.setRutas(data);
		return self;
	}
	this.setRutas = data => {
		rutas.setRutas(data);
		_tblRutas.render(data);
		fnUpdateView();
		return self;
	}
	this.saveRutas = () => {
		if (!_saveRutas)
			return self; // no hay cambios
		const fnReplace = (key, value) => ((key == "p2") ? undefined : value); // reduce size
		form.saveTable("#rutas-json", _tblRutas, fnReplace); // guardo los cambios en las rutas
		rro.setRender();
		resumen.setUpdatable();
		return fnUpdateView();
	}

	function fnUpdateForm() {
		const last = self.getLlegada() || CT;
		form.setval("#origen", last.destino).setval("#f1", sb.isoDate(last.dt2)).setval("#h1", sb.isoTimeShort(last.dt2))
			.setval("#destino").copy("#f2", "#f1").setval("#h2").setval("#principal", "0").setval("#desp")
			.delAttr("#f1", "max").delAttr("#f2", "min").hide(".grupo-matricula");
		if (!last.dt1)
			form.setFocus("#f1");
		else if (last.mask & 1) // es ruta principal?
			form.restart("#h1");
		else
			form.setFocus("#destino");
		self.setSaveRutas();
	}
	this.init = () => {
		_tblRutas = form.setTable("#tbl-rutas");
		_tblRutas.setMsgEmpty("msgRutasEmpty")
				.setBeforeRender(ruta.beforeRender).setRender(ruta.row).setFooter(ruta.tfoot)
				.setAfterRender(fnUpdateForm).set("#main", self.setRutaPrincipal);
		rutas.setResumen(_tblRutas.getResume());
		return self;
	}
}

export default  new RutasMaps();
