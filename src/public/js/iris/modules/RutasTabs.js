
import tabs from "../../components/Tabs.js";
import sb from "../../components/StringBox.js";
import i18n from "../../i18n/langs.js";

import { MUN, LOC } from "../data/rutas.js";
import ruta from "../model/Ruta.js";

export default function RutasMun(form) {
	const self = this; //self instance
	const perfil = form.get("perfil");
	const rutas = form.get("rutas");
	let _tblReadOnly, _tblRutasGasto, _tblRutasVp; // itinerario

	tabs.setAction("show-rutas-read", () => {
		if (!_tblReadOnly) {
			_tblReadOnly = form.setTable("#rutas-read");
			_tblReadOnly.setMsgEmpty("msgRutasEmpty").setBeforeRender(ruta.beforeRender).setRender(ruta.rowReadOnly).setFooter(ruta.tfoot);
		}
		if (form.get("render-rutas-read"))
			_tblReadOnly.render(rutas.getRutas());
		form.set("render-rutas-read", false);
	});
	tabs.setAction("show-rutas-vp", () => {
		if (!_tblRutasVp) {
			_tblRutasVp = form.setTable("#vp");
			_tblRutasVp.setMsgEmpty("msgRutasEmpty").setRender(ruta.rowVehiculoPropio).setFooter(ruta.tfootVehiculoPropio);
		}
		if (form.get("render-rutas-vp"))
			_tblRutasVp.render(rutas.getRutasVeiculoPropio());
		form.set("render-rutas-vp", false);
	});

	/*********** ASOCIACIÖN ENTRE RUTAS / GASTOS ***********/ 
	tabs.setInitEvent(12, tab12 => {
		_tblRutasGasto = form.setTable("#rutas-out");
		_tblRutasGasto.setMsgEmpty("msgRutasEmpty").setRender(ruta.rowRutasGasto).setFooter(ruta.tfootRutasGasto); 

		// init. all validations and inputs events only once
		tab12.querySelector("a#gasto-rutas").onclick = ev => { // button in tab12
			const etapas = tab12.querySelectorAll(".link-ruta:checked").map(el => el.value).join(",");
			if (etapas)
				form.setval("#trayectos", etapas).click("#uploadGasto");
			else
				form.showError("errLinkRuta");
			ev.preventDefault();
		}
	});
	tabs.setViewEvent(12, () => {
		_tblRutasGasto.render(rutas.getRutasSinGastos());
	});
	/*********** ASOCIACIÖN ENTRE RUTAS / GASTOS ***********/ 

	this.mun = () => {
		const arrRutas = rutas.getRutas();
		const ruta1Dia = Object.assign({}, perfil.isMun() ? MUN : LOC, arrRutas[0]);
		arrRutas[0] = ruta1Dia; // Save new data (routes.length = 1)

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
}
