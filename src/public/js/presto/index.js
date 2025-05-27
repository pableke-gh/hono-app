
import coll from "../components/CollectionHTML.js";
import presto from "./modules/presto.js";
import pDec from "./modules/partidaDec.js"
import pInc from "./modules/partidaInc.js"

coll.ready(() => {
	presto.init();
	pDec.init();
	pInc.init();
});

window.viewPresto = (xhr, status, args) => {
	if (!window.showAlerts(xhr, status, args))
		return false; // Server error
	const data = coll.parse(args.presto); // get presto data
	data.adjunto = args.adjunto; // set url adjunto
	const ejercicios = coll.parse(args.ejercicios); // get all ejercicios
	presto.view(data, ejercicios, coll.parse(args.firmas)); // udate common inputs and view 
	pDec.view(data, coll.parse(args.economicas)); // vista de la partida a decrementar
	pInc.view(coll.parse(args.data)); // cargo la tabla de partidas a incrementar
}
