
import PedidoForm from "./modules/pedido.js";
import PedidoFilterForm from "../core/modules/FilterHTML.js";
import PedidosTable from "./modules/pedidos.js";
import ControlesFilter from "./components/controles/Filter.js";
import ControlesTable from "./components/controles/Table.js";

import Adjunto from "./components/ppto/Adjunto.js";
import Presupuesto from "./components/ppto/Presupuesto.js";
import Referencia from "./components/ppto/Referencia.js";
import Proveedor from "./components/Proveedor.js";
import Categoria from "./components/Categoria.js";
import Aplicacion from "./components/Aplicacion.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("pedido-form", PedidoForm, { extends: "form" });
customElements.define("pedido-filter", PedidoFilterForm, { extends: "form" });
customElements.define("pedidos-table", PedidosTable, { extends: "table" });
customElements.define("control-filter", ControlesFilter, { extends: "form" });
customElements.define("control-table", ControlesTable, { extends: "table" });

customElements.define("btn-ppto", Adjunto, { extends: "button" });
customElements.define("ppto-file", Presupuesto, { extends: "input" });
customElements.define("ref-input", Referencia, { extends: "input" });

customElements.define("proveedor-input", Proveedor, { extends: "input" });
customElements.define("categoria-pedido", Categoria, { extends: "select" });
customElements.define("aplicacion-input", Aplicacion, { extends: "input" });
