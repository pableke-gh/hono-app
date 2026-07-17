
import BecaForm from "./modules/beca.js";
import BecaFilterForm from "../core/modules/FilterHTML.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("beca-form", BecaForm, { extends: "form" });
customElements.define("beca-filter", BecaFilterForm, { extends: "form" });
