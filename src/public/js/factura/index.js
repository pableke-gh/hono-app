
import coll from "../components/CollectionHTML.js";
import facturas from "./modules/facturas.js";

coll.ready(facturas.init);

window.viewFactura = (xhr, status, args) => {
   	if (!window.showAlerts(xhr, status, args))
		return false; // Server error
	facturas.view({
		fact: coll.parse(args.fact), // Read factura data
		lineas: coll.parse(args.lineas),
		tercero: coll.parse(args.tercero),
		delegaciones: coll.parse(args.delegaciones),
		firmas: coll.parse(args.firmas)
	});
}
