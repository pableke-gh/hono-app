
import tabs from "../../core/components/tabs/Tabs.js";
import Perfil from "./perfil.js";
import Paso1 from "./paso1.js";
import Rutas from "./rutas.js";
import Paso3 from "./paso3.js";
import Paso5 from "./paso5.js";
import Resumen from "./resumen.js";
import Paso9 from "./paso9.js";
import Otri from "./otri.js";

customElements.define("tab-perfil", Perfil, { extends: "div" });
customElements.define("tab-paso1", Paso1, { extends: "div" });
customElements.define("tab-rutas", Rutas, { extends: "div" });
customElements.define("tab-isu", Paso3, { extends: "div" });
customElements.define("tab-gastos", Paso5, { extends: "div" });
customElements.define("tab-resumen", Resumen, { extends: "div" });
customElements.define("tab-paso9", Paso9, { extends: "div" });
//customElements.define("tab-12", Paso9, { extends: "div" });
customElements.define("tab-otri", Otri, { extends: "div" });

export default tabs;
