
import coll from "../components/CollectionHTML.js";
import presto from "./modules/presto.js";

coll.ready(presto.init);

window.viewPresto = (xhr, status, args) => {
	if (!window.showAlerts(xhr, status, args))
		return false; // Server error
	presto.view({
		adjunto: args.adjunto,
		presto: coll.parse(args.presto),
		ejercicios: coll.parse(args.ejercicios),
		firmas: coll.parse(args.firmas),
		economicas: coll.parse(args.economicas),
	});
}
