
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";

import Ancladas from "./modules/tables/ancladas.js";
import Recientes from "./modules/tables/recientes.js";
import Facturas from "./modules/tabs/facturas.js";
import Usuarios from "./modules/tabs/usuarios.js";

coll.ready(() => {
	// global tabs actions
	tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
	tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
});

customElements.define("facturas-form", Facturas, { extends: "form" });
customElements.define("usuarios-form", Usuarios, { extends: "form" });
// For a valid custom element name, it must: Contain a hyphen (-)
customElements.define("ancladas-table", Ancladas, { extends: "table" });
customElements.define("recientes-table", Recientes, { extends: "table" });
