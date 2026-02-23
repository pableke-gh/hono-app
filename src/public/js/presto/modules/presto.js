
import valid from "../i18n/validators.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

import PartidaDec from "./partidaDec.js";
import PartidaInc from "./partidaInc.js";
import Partida030 from "./partida030.js";
import Prestos from "./prestos.js";
import Solicitud from "../../core/modules/solicitud.js";

class Presto extends Solicitud {
	#prestos = new Prestos();
	#pDec = new PartidaDec(this);
	#pInc = new PartidaInc(this);
	#p030 = new Partida030(this);

	init() { // init modules
		super.init(this.#prestos, valid);
		this.#prestos.init();

		this.#pDec.init();
		this.#pInc.init();
		this.#p030.init();
		return this;
	}

	onView(data) {
		this.#pDec.view(data); // cargo el formulario de la partida a decrementar
		this.#pInc.view(data.partidas); // cargo la tabla de partidas a incrementar
	}

	getSolicitudes = () => this.#prestos; // list
	getPartidaDec = () => this.#pDec;
	getPartidaInc = () => this.#pInc;
	getPartidas = this.#pInc.getPartidas;
	getPartida030 = () => this.#p030;

	setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item.int) && (presto.isTcr() || presto.isFce()) && this.showInfo(info);
		return this;
	}
}

export default new Presto();
