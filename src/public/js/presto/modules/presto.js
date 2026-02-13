
import pDec from "./partidaDec.js";
import pInc from "./partidaInc.js";
import p030 from "./partida030.js";
import partidas from "./partidas.js";
import prestos from "./prestos.js";
import Solicitud from "../../core/modules/solicitud.js";

class Presto extends Solicitud {
	constructor() {
		super(prestos, prestos.getSolicitud());
	}

	getPartidaDec = () => pDec;
	getPartidaInc = () => pInc;
	getPartida030 = () => p030;
	getPartidas = () => partidas;

	onView(data) {
		pDec.view(data); // cargo el formulario de la partida a decrementar
		pInc.view(data.partidas); // cargo la tabla de partidas a incrementar
	}
}

export default new Presto();
