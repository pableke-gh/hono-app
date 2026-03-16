
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import i18n from "../i18n/langs.js";

import irse from "./model/Irse.js";
import form from "./modules/irse.js";

coll.ready(() => {
	const list = form.init().getSolicitudes(); // init modules
	// PF hack for old version compatibility => remove when possible (override api call)
	const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; } // set param structure
	list.set("#view", data => (form.isCached(data.id) ? tabs.showTab(irse.getInitTab()) : window.rcView(fnIdParam(data))));
	list.set("#clone", data => (i18n.confirm("msgReactivar") && window.rcClone(fnIdParam(data)))); // set table action
	list.set("#reset", data => (i18n.confirm("msgReactivar") && window.rcReactivar(fnIdParam(data)))); // set table action

	window.createIrse = (xhr, status, args) => {
		list.clear(); // no element selected
		window.viewIrse(xhr, status, args, 0);
	}
	window.viewIrse = (xhr, status, args, tab) => {
		if (!window.showAlerts(xhr, status, args)) return;
		// merge server data with list and set in current irse instance
		irse.setData(Object.assign(list.getCurrent() || {}, coll.parse(args.data)));
		// referencia al interesado en la lista y la solicitud
		irse.setInteresado(coll.parse(args.interesado));

		const organicas = coll.parse(args.organicas);
		const rutas = coll.parse(args.rutas);
		const gastos = coll.parse(args.gastos);
		const dietas = coll.parse(args.dietas);
		const cuentas = coll.parse(args.cuentas);
		const firmas = coll.parse(args.firmas);

		form.view(organicas, rutas, gastos, dietas, cuentas, firmas); // configure view
		tabs.nextTab(tab ?? irse.get("tab")); // go to next tab
	}

	window.saveTab = () => form.setOk().setChanged().refresh(irse).working();
	window.nextTab = (xhr, status, args, tab) => {
		if (!window.showAlerts(xhr, status, args)) return;
		const interesado = irse.getInteresado(); // datos actuales
		irse.setData(coll.parse(args.data)); // update irse data
		irse.setInteresado(interesado); // preserve data
		const cuentas = coll.parse(args.cuentas);
		const firmas = coll.parse(args.firmas);
		form.next(cuentas, firmas, tab);
	}
});
