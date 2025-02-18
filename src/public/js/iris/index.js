
import coll from "../components/Collection.js";
import Form from "../components/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";
//import i18n from "../i18n/langs.js";

import list from "./modules/list.js";
import uxxiec from "./modules/uxxiec.js";
import Perfil from "./modules/Perfil.js";
<<<<<<< HEAD
import Rutas from "./modules/rutas.js";
=======
import Rutas from "./modules/Rutas.js";
>>>>>>> 5fbffcc64af7f854d428e84e299beb7051d41005
import validators from "./modules/tabs.js";

window.IRSE = {}; // global IRSE info
const formIrse = new Form("#xeco-irse");
const perfil = new Perfil(formIrse);
const rutas = new Rutas(formIrse);
pf.ready(list.init);

/*********** Expediente UXXI-EC ***********/
tabs.setInitEvent("uxxiec", () => uxxiec.init(formIrse));
tabs.setViewEvent("uxxiec", uxxiec.load);

window.validateP0 = () => formIrse.validate(perfil.validate);
window.validateP1 = () => formIrse.validate(validators.validateP1);
window.fnRemove = () => i18n.confirm("removeCom") && loading();
window.isCached = (id, tab) => (formIrse.isCached(id) && tabs.showTab(tab)); // if cached avoid navegation

window.viewTab = tabs.showTab;
window.showNextTab = window.showTab;
window.viewIrse = (xhr, status, args, tab) => {
	tabs.load(document); // load new tabs
	Object.assign(IRSE, coll.parse(args.data)); // update server info
	IRSE.editable = !IRSE.id || (IRSE.estado == 6); // solicitud editable

	// Init IRSE form
	formIrse.update().render(".i18n-tr-h1").setCache(IRSE.id); // current cache id
	perfil.init();
	rutas.init();
	//organicas.init(formIrse);

	tabs.nextTab(tab ?? IRSE.tab); // go to next tab
	pf.showAlerts(xhr, status, args); // show alerts
}
