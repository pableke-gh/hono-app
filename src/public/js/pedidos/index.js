
import PedidoFilterForm from "./modules/filter.js";
import PedidosTable from "./modules/pedidos.js";
import PedidoForm from "./modules/pedido.js";

import Adjunto from "./components/ppto/Adjunto.js";
import Presupuesto from "./components/ppto/Presupuesto.js";
import Referencia from "./components/ppto/Referencia.js";
import Proveedor from "./components/Proveedor.js";
import Categoria from "./components/Categoria.js";
import Aplicacion from "./components/Aplicacion.js";

import ControlesFilterForm from "./modules/ControlesFilter.js";
import ControlesTable from "./modules/ControlesTable.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("pedido-form", PedidoForm, { extends: "form" });
customElements.define("pedido-filter", PedidoFilterForm, { extends: "form" });
customElements.define("pedidos-table", PedidosTable, { extends: "table" });

customElements.define("btn-ppto", Adjunto, { extends: "button" });
customElements.define("ppto-file", Presupuesto, { extends: "input" });
customElements.define("ref-input", Referencia, { extends: "input" });

customElements.define("proveedor-input", Proveedor, { extends: "input" });
customElements.define("categoria-pedido", Categoria, { extends: "select" });
customElements.define("aplicacion-input", Aplicacion, { extends: "input" });

customElements.define("pedido-controles", ControlesFilterForm, { extends: "form" });
customElements.define("control-table", ControlesTable, { extends: "table" });
