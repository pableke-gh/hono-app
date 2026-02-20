
import valid from "../i18n/validators.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

import PartidaDec from "./partidaDec.js";
import PartidaInc from "./partidaInc.js";
import prestos from "./prestos.js";
import Solicitud from "../../core/modules/solicitud.js";

class Presto extends Solicitud {
	#pDec = new PartidaDec(this);
	#pInc = new PartidaInc(this);

	constructor() {
		super(prestos, prestos.getSolicitud());
	}

	init() { // init modules
		this.setValidators(valid);
		this.#pDec.init();
		this.#pInc.init();
		return super.init(); // configure inputs
	}

	onView(data) {
		this.#pDec.view(data); // cargo el formulario de la partida a decrementar
		this.#pInc.view(data.partidas); // cargo la tabla de partidas a incrementar
	}

	getPartidaDec = () => this.#pDec;
	getPartidaInc = () => this.#pInc;
	getPartidas = this.#pInc.getPartidas;

	setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item.int) && (presto.isTcr() || presto.isFce()) && this.showInfo(info);
		return this;
	}
}

export default new Presto();
