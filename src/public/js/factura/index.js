
import coll from "../components/CollectionHTML.js";
import pf from "../components/Primefaces.js";
import facturas from "./modules/facturas.js";
import fiscal from "./modules/fiscal.js";

pf.ready(() => {
	facturas.init();
	fiscal.init();

	window.viewFactura = (xhr, status, args) => {
    	if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args.fact); // Read factura data
		facturas.view(data, coll.parse(args.data), coll.parse(args.firmas));
		// cargo los datos del tercero y de las delegaciones
		fiscal.load(coll.parse(args.tercero), coll.parse(args.delegaciones))
				.setTercero(data.idTer, data.nif + " - " + data.tercero)
				.setSujeto(data.sujeto) // update sujeto / exento
				.setFace(data.face); // update face inputs group
	}

	window.loadFirmas = (xhr, status, args) => {
        if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args.fact); // get presto data
		facturas.setFirmas(data, coll.parse(args.firmas)); // update tab
	}
});
