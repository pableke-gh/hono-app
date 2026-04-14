
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "./i18n/langs.js";
import valid from "./i18n/validators.js";

import PedidosTable from "./modules/pedidos.js";
import PedidoForm from "./modules/pedido.js";

document.addEventListener("DOMContentLoaded", () => {
});

customElements.define("pedidos-table", PedidosTable, { extends: "table" });
customElements.define("pedido-form", PedidoForm, { extends: "form" });
