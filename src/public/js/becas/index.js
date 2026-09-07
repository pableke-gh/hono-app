
import BecaForm from "./modules/beca.js";
import TerceroForm from "./modules/tercero.js";
import BecaFilterForm from "../core/modules/Filter.js";

import Actions from "./components/Actions.js";
import Titulo from "./components/Titulo.js";
import MsgReject from "./components/MsgReject.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("beca-form", BecaForm, { extends: "form" });
customElements.define("tercero-form", TerceroForm, { extends: "form" });
customElements.define("beca-filter", BecaFilterForm, { extends: "form" });

customElements.define("run-action", Actions, { extends: "a" });
customElements.define("titulo-h2", Titulo, { extends: "h2" });
customElements.define("msg-reject", MsgReject, { extends: "p" });
