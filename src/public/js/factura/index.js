
import coll from "../components/CollectionHTML.js";
import tabs from "../core/components/tabs/TabsOld.js";

import factura from "./model/Factura.js";
import form from "./modules/factura.js";
import ButtonSave from "./components/buttons/Save.js";
import ButtonSubsanar from "./components/buttons/Subsanar.js";
import ButtonReset from "./components/buttons/Reset.js";

coll.ready(() => { // init. fact modules
	const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
	form.init().set("show-factura-uae", fnShowFactUae);

	const fnBuild = (tipo, subtipo) => ({ solicitud: { tipo, subtipo, imp: 0, iva: 0 } });
	tabs.setAction("factura", () => form.create(fnBuild(1, 14))); // create factura
	tabs.setAction("cartap", () => form.create(fnBuild(3, 13))); // create carta de pago
	//tabs.setAction("ttpp", () => form.create(fnBuild(6, 25))); // TTPP a empresa
});

customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-subsanar", ButtonSubsanar, { extends: "button" });
customElements.define("btn-reset", ButtonReset, { extends: "button" });
