
import tables from "../../../core/components/tables/Tables.js";
import Becas from "./becas.js";
import Terceros from "./terceros.js";

customElements.define("becas-table", Becas, { extends: "table" });
customElements.define("terceros-table", Terceros, { extends: "table" });

export default tables;
