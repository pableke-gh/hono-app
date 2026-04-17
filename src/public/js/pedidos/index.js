
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "./i18n/langs.js";
import valid from "./i18n/validators.js";

import FilterForm from "./modules/filter.js";
import PedidosTable from "./modules/pedidos.js";
import PedidoForm from "./modules/pedido.js";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.forms["pedido-form"];
	tabs.setAction("create", form.create);
});

customElements.define("filter-form", FilterForm, { extends: "form" });
customElements.define("pedidos-table", PedidosTable, { extends: "table" });
customElements.define("pedido-form", PedidoForm, { extends: "form" });
