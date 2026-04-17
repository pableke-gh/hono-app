
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";

import factura from "./model/Factura.js";
import form from "./modules/factura.js";
import ButtonSave from "./components/ButtonSave.js";
import ButtonSubsanar from "./components/ButtonSubsanar.js";
import ButtonReset from "./components/ButtonReset.js";

coll.ready(() => { // init. fact modules
	const fnShowGestor = () => factura.isFace() || factura.isPlataforma();
	const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
	form.init().set("show-factura-uae", fnShowFactUae).set("show-gestor", fnShowGestor);

	const fnBuild = (tipo, subtipo) => ({ solicitud: { tipo, subtipo, imp: 0, iva: 0 } });
	tabs.setAction("factura", () => form.create(fnBuild(1, 14))); // create factura
	tabs.setAction("cartap", () => form.create(fnBuild(3, 13))); // create carta de pago
	//tabs.setAction("ttpp", () => form.create(fnBuild(6, 25))); // TTPP a empresa
});

customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-subsanar", ButtonSubsanar, { extends: "button" });
customElements.define("btn-reset", ButtonReset, { extends: "button" });
