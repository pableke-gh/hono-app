
import coll from "../components/CollectionHTML.js";
import sb from "../components/types/StringBox.js";
import tabs from "../core/components/tabs/Tabs.js";

import factura from "./model/Factura.js";
import form from "./modules/factura.js";

import ButtonSave from "./components/buttons/Save.js";
import ButtonFirmar from "./components/buttons/Firmar.js";
import ButtonRechazar from "./components/buttons/Rechazar.js";
import ButtonCancelar from "./components/buttons/Cancelar.js";
import ButtonSubsanar from "./components/buttons/Subsanar.js";
import ButtonRemove from "./components/buttons/Remove.js";
import MsgReject from "./components/MsgReject.js";

coll.ready(() => { // init. fact modules
	const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
	form.init().set("show-factura-uae", fnShowFactUae);

	const ej = sb.getYear(); // current year
	const fnBuild = (tipo, subtipo) => ({ solicitud: { ej, tipo, subtipo, imp: 0, iva: 0 } });
	tabs.setAction("factura", () => form.create(fnBuild(1, 14))); // create factura
	tabs.setAction("cartap", () => form.create(fnBuild(3, 13))); // create carta de pago
	//tabs.setAction("ttpp", () => form.create(fnBuild(6, 25))); // TTPP a empresa
});

customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-firmar", ButtonFirmar, { extends: "button" });
customElements.define("btn-rechazar", ButtonRechazar, { extends: "button" });
customElements.define("btn-cancelar", ButtonCancelar, { extends: "button" });
customElements.define("btn-subsanar", ButtonSubsanar, { extends: "button" });
customElements.define("btn-remove", ButtonRemove, { extends: "button" });
customElements.define("msg-reject", MsgReject, { extends: "p" });
