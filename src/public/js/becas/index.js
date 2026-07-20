
import BecaForm from "./modules/beca.js";
import BecaFilterForm from "../core/modules/FilterHTML.js";
import MsgReject from "./components/MsgReject.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("beca-form", BecaForm, { extends: "form" });
customElements.define("beca-filter", BecaFilterForm, { extends: "form" });
customElements.define("msg-reject", MsgReject, { extends: "p" });
