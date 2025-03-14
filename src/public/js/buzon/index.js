
import dom from "../components/forms/DomBox.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";

import bo from "./modules/organicas.js";
import bu from "./modules/usuarios.js";
import bf from "./modules/facturas.js";
import buzon from "./model/Buzon.js";

pf.ready(() => { // on load view
	/************** Buzon de organicas **************/
	bo.init(); bu.init(); //bf.init();

	tabs.setAction("report", () => {
		const data = buzon.getData(); // current row
		pf.fetch("report", { id: data.org, ut: bo.getForm().getval("#utProv") });
		tabs.closeModal(); // always close modal
	});

	// update colspan on small screens
	const fnResize = () => dom.setAttr(bo.getRecientes().getLastRow().cells[0], "colspan", dom.isMediaXs() ? 3 : 4);
	window.addEventListener("resize", fnResize);
	fnResize(); // init colspan on load
	/************** Buzon de organicas **************/

	/************** Formulario de facturas **************/
	window.factUpload = (xhr, status, args) => {
		if (window.showTab(xhr, status, args, 0)) { // reload all tables
			bo.getForm().fireReset().showOk("saveOk"); // clear inputs, autofocus and message
			bf.init(); // clear file names
		}
	}
	/************** Formulario de facturas **************/
});
