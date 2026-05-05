
import tabs from "../components/Tabs.js";
import PedidoFilterForm from "./modules/filter.js";
import PedidosTable from "./modules/pedidos.js";
import PedidoForm from "./modules/pedido.js";
import ControlesFilterForm from "./modules/ControlesFilter.js";
import ControlesTable from "./modules/ControlesTable.js";

document.addEventListener("DOMContentLoaded", () => {
	const form = document.forms["pedido-form"];
	tabs.setAction("create", form.create);
});

customElements.define("pedido-filter", PedidoFilterForm, { extends: "form" });
customElements.define("pedidos-table", PedidosTable, { extends: "table" });
customElements.define("pedido-form", PedidoForm, { extends: "form" });

customElements.define("pedido-controles", ControlesFilterForm, { extends: "form" });
customElements.define("control-table", ControlesTable, { extends: "table" });
