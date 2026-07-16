
import tables from "../../../core/components/tables/Tables.js";
import Facturas from "./facturas.js";
import Lineas from "./lineas.js";

customElements.define("fact-table", Facturas, { extends: "table" });
customElements.define("lineas-table", Lineas, { extends: "table" });

export default tables;
