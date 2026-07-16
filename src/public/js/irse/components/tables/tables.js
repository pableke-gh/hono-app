
import tables from "../../../core/components/tables/Tables.js";
import Solicitudes from "./solicitudes.js";
import Organicas from "./organicas.js";
import Rutas from "./rutas.js";
import Itinerario from "./itinerario.js";
import RutasPendientes from "./pendientes.js";
import Gastos from "./gastos.js";
import Kilometraje from "./kilometraje.js";
import Transportes from "./transportes.js";
import Pernoctas from "./pernoctas.js";
import Dietas from "./dietas.js";
import Extraordinarios from "./extras.js";
import Imputacion from "./imputacion.js";

customElements.define("irse-table", Solicitudes, { extends: "table" });
customElements.define("organicas-table", Organicas, { extends: "table" });
customElements.define("rutas-table", Rutas, { extends: "table" });
customElements.define("itinerario-table", Itinerario, { extends: "table" });
customElements.define("pendientes-table", RutasPendientes, { extends: "table" });
customElements.define("gastos-table", Gastos, { extends: "table" });
customElements.define("km-table", Kilometraje, { extends: "table" });
customElements.define("transportes-table", Transportes, { extends: "table" });
customElements.define("pernoctas-table", Pernoctas, { extends: "table" });
customElements.define("dietas-table", Dietas, { extends: "table" });
customElements.define("extra-table", Extraordinarios, { extends: "table" });
customElements.define("imputacion-table", Imputacion, { extends: "table" });

export default tables;
