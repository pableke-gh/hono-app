
import coll from "../components/Collection.js";
import sb from "../components/types/StringBox.js";
import tabs from "../components/Tabs.js";

import irse from "./model/Irse.js";
import form from "./modules/irse.js";

coll.ready(() => {
	const list = form.init().getSolicitudes(); // init modules

	// PF hack for old version compatibility => remove when possible
	const fnIdParam = data => { loading(); return [{ name: "id", value: data.id }]; } // set param structure
	list.set("#view", data => (form.isCached(data.id) ? tabs.showTab(irse.getInitTab()) : window.rcView(fnIdParam(data))));

	window.saveTab = () => form.setOk().setChanged().refresh(irse).working();
	window.createIrse = (xhr, status, args) => {
		list.clear(); // no element selected
		window.viewIrse(xhr, status, args, 0);
	}
	window.viewIrse = (xhr, status, args, tab) => {
		if (!window.showAlerts(xhr, status, args)) return;
		irse.setData(coll.parse(args.data)); // set irse data
		const organicas = coll.parse(args.organicas);
		const rutas = coll.parse(args.rutas);
		const gastos = coll.parse(args.gastos);
		const dietas = coll.parse(args.dietas);
		const firmas = coll.parse(args.firmas);

		form.view(organicas, rutas, gastos, dietas, firmas); // configure view
		const fnSync = ev => form.eachInput(".ui-matricula", el => { el.value = sb.toUpperWord(ev.target.value); }); 
		form.onChange(".ui-matricula", fnSync).refresh(irse); // update state
		tabs.reset([ 0, 1, 3, 9 ]).nextTab(tab ?? irse.get("tab")); // go to next tab
	}
	window.showTab = (xhr, status, args, tab) => {
		if (!window.showAlerts(xhr, status, args)) return;
		irse.setData(coll.parse(args.data)); // set irse data
		const rutas = coll.parse(args.rutas);
		const gastos = coll.parse(args.gastos);
		const dietas = coll.parse(args.dietas);
		const firmas = coll.parse(args.firmas);

		form.load(rutas, gastos, dietas, firmas); // parse firmas
		tabs.goTab(tab); // go selected/next tab
	}
	window.closeForm = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args)) return;
		list.setWorking(); // update state
		form.viewInit(); // go init tab
	}
});
