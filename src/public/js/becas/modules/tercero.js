
import api from "../../core/components/Api.js";
import Tab from "../../core/components/tabs/Tab.js";
import observer from "../../core/util/Observer.js";

import Tercero from "../components/tercero/Tercero.js";
import AddTercero from "../components/tercero/AddTercero.js";
import Terceros from "../components/tables/terceros.js";
import Paises from "../components/tercero/Paises.js";
import CreateTercero from "../components/tercero/Create.js";

export default class TerceroTab extends Tab {
}

customElements.define("tercero-input", Tercero, { extends: "input" });
customElements.define("add-tercero", AddTercero, { extends: "button" });
customElements.define("terceros-table", Terceros, { extends: "table" });
customElements.define("paises-list", Paises, { extends: "select" });
customElements.define("create-tercero", CreateTercero, { extends: "button" });
