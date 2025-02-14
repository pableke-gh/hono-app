
import coll from "../components/Collection.js";
import Form from "../components/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";
//import i18n from "../i18n/langs.js";

import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";
import Perfil from "./modules/Perfil.js";

const formIrse = new Form("#xeco-irse");
const perfil = new Perfil(formIrse);
pf.ready(list.init);

/*********** Expediente UXXI-EC ***********/
tabs.setInitEvent("uxxiec", () => uxxiec.init(formIrse));
tabs.setViewEvent("uxxiec", uxxiec.load);

window.viewTab = tabs.showTab;
window.showNextTab = window.showTab;
window.viewIrse = (xhr, status, args, tab) => {
	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info

	// Init IRSE form
	//dom.setTables(formIrse.getForm()).setInputs(formIrse.getElements()); // Update tables and inputs
	formIrse.update().render(".i18n-tr-h1").readonly(true, ".ui-state-disabled").setCache(IRSE.id); // current cache id
	perfil.init();
	//rutas.init(formIrse);
	//organicas.init(formIrse);
	tabs.nextTab(tab ?? IRSE.tab); // go to next tab
	pf.showAlerts(xhr, status, args); // show alerts
}
