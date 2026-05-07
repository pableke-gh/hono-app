
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";
import i18n from "../i18n/langs.js";

import irse from "./model/Irse.js";
import rutas from "./model/Rutas.js";
import gastos from "./model/Gastos.js";
import form from "./modules/irse.js";

coll.ready(() => {
	const list = form.init().getSolicitudes(); // init modules

	tabs.setAction("create", () => {
		list.clear(); // no element selected
		api.init().json("/uae/iris/create").then(data => { // server response
			irse.setData(data.solicitud);
			rutas.setRutas(data.rutas); // registro de rutas
			gastos.setGastos(data.gastos) // registro de gastos
					.setSubv(data.subv).setCongreso(data.congreso) // paso 3
					.setKm(data.km).setAc(data.ac) // pasos 3/4 y resumen
					.setIban(data.iban).setBanco(data.banco); // paso 9

			form.view(data.interesado, data.organicas, data.dietas, data.cuentas, data.firmas); // configure view
			tabs.show(0); // go tab 0 (perfil)
		});
	});

	const _load = (row, data) => {
		// merge server data with list and set in current irse instance
		irse.setData(Object.assign(row, data.solicitud));

		rutas.setRutas(data.rutas); // registro de rutas
		gastos.setGastos(data.gastos) // registro de gastos
				.setSubv(data.subv).setCongreso(data.congreso) // paso 3
				.setKm(data.km).setAc(data.ac) // pasos 3/4 y resumen
				.setIban(data.iban).setBanco(data.banco); // paso 9

		form.view(data.interesado, data.organicas, data.dietas, data.cuentas, data.firmas); // configure view
		tabs.next(irse.getInitTab()); // go to next tab
	}
	list.set("#view", row => {
		if (form.isCached(row.id))
			return tabs.show(irse.getInitTab());
		const url = "/uae/iris/view?id=" + row.id; // resource
		api.init().json(url).then(data => _load(row, data));
	});
	list.set("#clone", row => { // user confirmation and clone
		i18n.confirm("msgReactivar") && api.init().json("/uae/iris/clone?id=" + row.id).then(data => _load(row, data));
	});
});
