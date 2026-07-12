
import Conciliar from "./modules/conciliar.js";
import Recibos from "./modules/recibos.js";
import Paneles from "./modules/paneles.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("panel-form", Paneles, { extends: "form" });
customElements.define("conciliar-form", Conciliar, { extends: "form" });
customElements.define("recibos-form", Recibos, { extends: "form" });
