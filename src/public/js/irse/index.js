
import coll from "../components/Collection.js";
import tabs from "../components/Tabs.js";
import i18n from "./i18n/langs.js";

import irse from "./model/Irse.js";
import form from "./modules/irse.js";

coll.ready(() => {
	form.init(); // init modules

	//PF needs confirmation in onclick attribute
	window.fnUnlink = () => (i18n.confirm("unlink") && loading());
	window.viewIrse = (xhr, status, args, tab) => {
		irse.setData(coll.parse(args.data));
		form.view(coll.parse(args.firmas)); // configure view
		tabs.reset([ 0, 1, 3, 6, 9 ]).load(form.getForm()); // reload links
		tabs.nextTab(tab ?? irse.get("tab")); // go to next tab
		window.showAlerts(xhr, status, args); // alerts
	}
});
