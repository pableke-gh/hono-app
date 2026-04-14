
import valid from "../i18n/validators.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

import PartidaDec from "./PartidaDec.js";
import PartidaInc from "./PartidaInc.js";
import Partida030 from "./Partida030.js";

import PrestoSolicitudes from "../components/prestos.js";
import Solicitud from "../../core/modules/solicitud.js";

class Presto extends Solicitud {
	#pDec = new PartidaDec(this);
	#pInc = new PartidaInc(this);
	#p030 = new Partida030(this);

	init() { // init modules
		super.init(valid);
		this.#pDec.init();
		this.#pInc.init();
		this.#p030.init();
		return this;
	}

	onView(data) {
		this.#pDec.view(data); // cargo el formulario de la partida a decrementar
		this.#pInc.view(data.partidas); // cargo la tabla de partidas a incrementar
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
	getPartidaDec = () => this.#pDec; // partida que se decrementa
	getPartidaInc = () => this.#pInc; // partidas a incrementar
	getPartidas = this.#pInc.getPartidas;
	getPartida030 = () => this.#p030;

	setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item.int) && (presto.isTcr() || presto.isFce()) && this.showInfo(info);
		return this;
	}
}

customElements.define("presto-table", PrestoSolicitudes, { extends: "table" });

export default new Presto();
