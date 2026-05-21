
import PedidoFilterForm from "./modules/filter.js";
import PedidosTable from "./modules/pedidos.js";
import PedidoForm from "./modules/pedido.js";

import Referencia from "./components/Referencia.js";
import Proveedor from "./components/Proveedor.js";
import Categoria from "./components/Categoria.js";
import Aplicacion from "./components/Aplicacion.js";
import ButtonSave from "./components/ButtonSave.js";
import Firmas from "./components/Firmas.js";

import ControlesFilterForm from "./modules/ControlesFilter.js";
import ControlesTable from "./modules/ControlesTable.js";

//document.addEventListener("DOMContentLoaded", () => {});

customElements.define("pedido-filter", PedidoFilterForm, { extends: "form" });
customElements.define("pedidos-table", PedidosTable, { extends: "table" });
customElements.define("pedido-form", PedidoForm, { extends: "form" });

customElements.define("ref-input", Referencia, { extends: "input" });
customElements.define("proveedor-input", Proveedor, { extends: "input" });
customElements.define("categoria-pedido", Categoria, { extends: "select" });
customElements.define("aplicacion-input", Aplicacion, { extends: "input" });
customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("firmas-block", Firmas, { extends: "div" });

customElements.define("pedido-controles", ControlesFilterForm, { extends: "form" });
customElements.define("control-table", ControlesTable, { extends: "table" });
