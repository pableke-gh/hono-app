
import coll from "../components/Collection.js";
import form from "./modules/irse.js";

import Actions from "./components/Actions.js";
import Titulo from "./components/Titulo.js";
import MsgReject from "./components/MsgReject.js";
import Firmas from "../core/components/layouts/Firmas.js";

coll.ready(() => {
	const list = form.init().getSolicitudes(); // init modules
	list.set("#clone", row => form.clone(row));
});

customElements.define("titulo-h2", Titulo, { extends: "h2" });
customElements.define("run-action", Actions, { extends: "a" });
customElements.define("firmas-block", Firmas, { extends: "div" });
customElements.define("msg-reject", MsgReject, { extends: "p" });
