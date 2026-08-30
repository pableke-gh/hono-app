
import coll from "../components/CollectionHTML.js";
import form from "./modules/factura.js";

import Actions from "./components/Actions.js";
import ButtonSave from "./components/buttons/Save.js";
import ButtonFirmar from "./components/buttons/Firmar.js";
import ButtonRechazar from "./components/buttons/Rechazar.js";
import ButtonCancelar from "./components/buttons/Cancelar.js";
import ButtonSubsanar from "./components/buttons/Subsanar.js";
import ButtonRemove from "./components/buttons/Remove.js";
import MsgReject from "./components/MsgReject.js";

// init. fact modules
coll.ready(() => form.init());

customElements.define("run-action", Actions, { extends: "a" });
customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-firmar", ButtonFirmar, { extends: "button" });
customElements.define("btn-rechazar", ButtonRechazar, { extends: "button" });
customElements.define("btn-cancelar", ButtonCancelar, { extends: "button" });
customElements.define("btn-subsanar", ButtonSubsanar, { extends: "button" });
customElements.define("btn-remove", ButtonRemove, { extends: "button" });
customElements.define("msg-reject", MsgReject, { extends: "p" });
