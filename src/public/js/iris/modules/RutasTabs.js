
import coll from "../../components/CollectionHTML.js";
import tabs from "../../components/Tabs.js";
import sb from "../../components/StringBox.js";

import iris from "./iris.js";
import dietas from "./dietas.js";
import ruta from "../model/Ruta.js";

function RutasMun() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _rutas, _tblRutas, _tblReadOnly, _tblRutasGasto, _tblRutasVp; // itinerario
	let _saveRutas, _renderRutasRead, _renderRutasVp; // bool indicator

	this.getForm = () => form;
	this.getRutas = () => _rutas;
	this.getTable = () => _tblRutas;
	this.size = () => coll.size(_rutas);
	this.isEmpty = () => coll.isEmpty(_rutas);

	this.getSalida = () => _rutas[0]; // primera ruta
	this.getLlegada = () => _rutas.at(-1); // ultima ruta

	//this.isRenderRutasRead = () => _renderRutasRead;
	//this.setRenderRutasRead = () => { _renderRutasRead = true; return self; }
	//this.isRenderRutasVp = () => _renderRutasVp;
	//this.setRenderRutasVp = () => { _renderRutasVp = true; return self; }
	this.setSaveRutas = () => {
		_saveRutas = _renderRutasRead = _renderRutasVp = true;
		return self;
	}

	this.getRutasVeiculoPropio = () => _rutas.filter(ruta.isVehiculoPropio);
	this.getRutasSinGastos = () => _rutas.filter(data => (ruta.isAsociableGasto(data) && !data.g));
	this.getRutaPrincipal = () => { // calculo la ruta principal del itinerario
		let diff = 0; // diferencia en milisegundos
		let principal = _rutas[0]; // primera ruta
		for (let i = 1; i < _rutas.length; i++) { //itero el itinerario
			const aux = sb.diffDate(_rutas[i].dt1, _rutas[i - 1].dt2);
			if (diff < aux) { // ruta en la que paso mas tiempo
				diff = aux;
				principal = _rutas[i - 1];
			}
		}
		return principal;
	}

	this.setRutaPrincipal = data => {
		_rutas.forEach(ruta.setOrdinaria);
		ruta.setPrincipal(data);
		_tblRutas.render(_rutas);
		return self;
	}
	this.setRutas = data => {
		_rutas = data;
		_tblRutas.render(_rutas);
		_saveRutas = false;
		return self;
	}
	this.saveRutas = () => {
		if (!_saveRutas)
			return self; // no hay cambios
		const fnReplace = (key, value) => (((key == "p2") || key.endsWith("Option")) ? undefined : value);
		form.saveTable("#rutas-json", _tblRutas, fnReplace); // guardo los cambios en las rutas
		_saveRutas = false;
		dietas.build();
		return self;
	}

	tabs.setAction("show-rutas-read", () => {
		if (!_tblReadOnly) {
			_tblReadOnly = form.setTable("#rutas-read");
			_tblReadOnly.setMsgEmpty("msgRutasEmpty").setBeforeRender(ruta.beforeRender).setRender(ruta.rowReadOnly).setFooter(ruta.tfoot);
		}
		if (_renderRutasRead)
			_tblReadOnly.render(_rutas);
		_renderRutasRead = false;
	});
	tabs.setAction("show-rutas-vp", () => {
		if (!_tblRutasVp) {
			_tblRutasVp = form.setTable("#vp");
			_tblRutasVp.setMsgEmpty("msgRutasEmpty")
					.setBeforeRender(ruta.beforeRender).setRender(ruta.rowVehiculoPropio).setFooter(ruta.tfootVehiculoPropio)
					.setAfterRender(resume => { ruta.afterRender(resume); form.setVisible("#justifi-km", resume.justifi); });
		}
		if (_renderRutasVp)
			_tblRutasVp.render(self.getRutasVeiculoPropio());
		_renderRutasVp = false;
	});

	/*********** ASOCIACIÖN ENTRE RUTAS / GASTOS ***********/ 
	tabs.setInitEvent(12, tab12 => {
		_tblRutasGasto = form.setTable("#rutas-out");
		_tblRutasGasto.setMsgEmpty("msgRutasEmpty").setRender(ruta.rowRutasGasto).setFooter(ruta.tfootRutasGasto); 

		// init. all validations and inputs events only once
		tab12.querySelector("a#gasto-rutas").onclick = ev => { // button in tab12
			const list = tab12.querySelectorAll(".link-ruta:checked").map(el => el.value).join(",");
			if (list)
				form.setStrval("#rutas-json", list).click("#uploadGasto");
			else
				form.showError("errLinkRuta");
			ev.preventDefault();
		}
	});
	tabs.setViewEvent(12, () => {
		_tblRutasGasto.render(self.getRutasSinGastos());
	});
	/*********** ASOCIACIÖN ENTRE RUTAS / GASTOS ***********/ 

	this.init = () => {
		_tblRutas = form.setTable("#tbl-rutas");
		return self;
	}
}

export default  new RutasMun();
