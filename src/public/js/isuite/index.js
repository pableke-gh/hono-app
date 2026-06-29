
import Conciliar from "./modules/conciliar.js";
import Recibos from "./modules/recibos.js";
import Isuite from "./modules/isuite.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("isuite-form", Isuite, { extends: "form" });
customElements.define("conciliar-form", Conciliar, { extends: "form" });
customElements.define("recibos-form", Recibos, { extends: "form" });
