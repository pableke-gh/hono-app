
import coll from "../components/CollectionHTML.js";
import pf from "../components/Primefaces.js";

import presto from "./modules/presto.js";
import pDec from "./modules/partidaDec.js"
import pInc from "./modules/partidaInc.js"

pf.ready(() => {
	presto.init(); pDec.init(); pInc.init();

	/****** partida a incrementar ******/
	window.loadEconomicasInc = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		const acOrgInc = pInc.getOrganica(); // autocompletable
		pInc.setEconomicas(coll.parse(args?.data)); // load new items
		pDec.setAvisoFa(acOrgInc.getCurrentItem()); // aviso para organicas afectadas en TCR o FCE
	}
	/****** partida a incrementar ******/

	window.viewPresto = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args.presto); // get presto data
		presto.view(data, coll.parse(args.firmas)); // udate inputs view
		// cargo los datos de la partida a decrementar e incrementar + firmas
        pDec.setEconomica(coll.parse(args.economicas)).setOrganica(data.idOrgDec, data.orgDec + " - " + data.dOrgDec);
		pInc.setPartidas(coll.parse(args.data)); // Load table partidas
	}

	window.loadFirmas = (xhr, status, args) => {
        if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args.presto); // get presto data
		presto.setFirmas(data, JSON.read(args.firmas)); // update tab
	}
});
