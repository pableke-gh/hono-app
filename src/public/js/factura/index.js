
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";
import facturas from "./modules/facturas.js";
import fiscal from "./modules/fiscal.js";
import lineas from "./modules/lineas.js";

pf.ready(() => {
	facturas.init();
	fiscal.init();
	lineas.init();

	window.viewFactura = (xhr, status, args) => {
    	if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		const data = JSON.read(args.fact); // Read factura data
		lineas.setLineas(JSON.read(args.data)); // Load conceptos and iva input
		facturas.view(data, JSON.read(args.firmas)); // Load data-model before view
		// cargo los datos del tercero y de las delegaciones
		fiscal.load(JSON.read(args.tercero), JSON.read(args.delegaciones))
				.setTercero(data.idTer, data.nif + " - " + data.tercero)
				.setSujeto(data.sujeto) // update sujeto / exento
				.setFace(data.face); // update face inputs group
		tabs.setActions(document).showTab(1); // show form tab
	}

	window.updateFact = (xhr, status, args, tab) => {
        if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		facturas.update(JSON.read(args.firmas)); // firmas asociadas
		tabs.setActions(document).showTab(tab); // navego al tab
	}
});
