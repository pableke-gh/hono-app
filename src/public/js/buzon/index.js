
import coll from "../components/CollectionHTML.js";
import tabs from "../core/components/tabs/Tabs.js";

import Ancladas from "./components/tables/ancladas.js";
import Recientes from "./components/tables/recientes.js";
import Facturas from "./modules/facturas.js";
import Usuarios from "./modules/usuarios.js";

coll.ready(() => {
	// global tabs actions
	tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
	tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
});

customElements.define("facturas-form", Facturas, { extends: "form" });
customElements.define("usuarios-form", Usuarios, { extends: "form" });
customElements.define("ancladas-table", Ancladas, { extends: "table" });
customElements.define("recientes-table", Recientes, { extends: "table" });
