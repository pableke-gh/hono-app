
import coll from "../../components/CollectionHTML.js";
import tabs from "../../components/Tabs.js";
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";

import iris from "./iris.js";
import perfil from "./perfil.js";
import ruta from "../model/Ruta.js";
import { MUN, LOC } from "../data/rutas.js";

function RutasMun() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _rutas, _tblReadOnly, _tblRutasGasto, _tblRutasVp; // itinerario
	let _renderRutasRead, _renderRutasVp; // bool indicator

	this.getRutas = () => _rutas;
	this.setRutas = data => { _rutas = data; return self; }
	this.size = () => coll.size(_rutas);
	this.isEmpty = () => coll.isEmpty(_rutas);

	this.getSalida = () => _rutas[0]; // primera ruta
	this.getLlegada = () => _rutas.at(-1); // ultima ruta

	this.isRenderRutasRead = () => _renderRutasRead;
	this.setRenderRutasRead = () => { _renderRutasRead = true; return self; }
	this.isRenderRutasVp = () => _renderRutasVp;
	this.setRenderRutasVp = () => { _renderRutasVp = true; return self; }

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
			_tblRutasVp.setMsgEmpty("msgRutasEmpty").setBeforeRender(ruta.beforeRender).setRender(ruta.rowVehiculoPropio).setFooter(ruta.tfootVehiculoPropio);
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

	this.mun = () => {
		const ruta1Dia = Object.assign({}, perfil.isMun() ? MUN : LOC, _rutas[0]);
		_rutas[0] = ruta1Dia; // Save new data (routes.length = 1)

		form.afterChange(ev => { form.set("saveRutas", true); }) // Any input change => save all rutas
			.setVisible(".grupo-matricula", ruta.isVehiculoPropio(ruta1Dia)) // grupo asociado al vehiculo propio
			.setField("#origen", ruta1Dia.origen, ev => { ruta1Dia.origen = ruta1Dia.destino = ev.target.value; })
			.setField("#desp", ruta1Dia.desp, ev => { ruta1Dia.desp = +ev.target.value; })
			.setField("#dist", ruta1Dia.km1, ev => { ruta1Dia.km1 = ruta1Dia.km2 = i18n.toFloat(ev.target.value); })
			.setField("#f2", ruta1Dia.dt2, ev => { ruta1Dia.dt2 = sb.endDay(ev.target.value); })
			.setField("#f1", ruta1Dia.dt1, ev => {
				ruta1Dia.dt1 = ev.target.value;
				//si no hay f2 considero el dia completo de f1 => afecta a las validaciones
				ruta1Dia.dt2 = form.getInput("#f2") ? ruta1Dia.dt2 : sb.endDay(ruta1Dia.dt1);
			});
		return self;
	}

	this.init = () => {
		return self.setRutas(coll.parse(form.getText("#rutas-data")));
	}
}

export default  new RutasMun();
