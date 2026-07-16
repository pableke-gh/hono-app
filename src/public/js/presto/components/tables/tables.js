
import tables from "../../../core/components/tables/Tables.js";
import Prestos from "./prestos.js";
import Partidas from "./partidas.js";

customElements.define("presto-table", Prestos, { extends: "table" });
customElements.define("partidas-table", Partidas, { extends: "table" });

export default tables;
