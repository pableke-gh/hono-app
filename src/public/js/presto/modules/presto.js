
import api from "../../core/components/Api.js"
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

import Ejercicio from "../components/pDec/Ejercicio.js";
import AddPartida from "../components/pInc/AddPartida.js";
import OrganicaInc from "../components/pInc/Organica.js";
import Organica030 from "../components/p030/Organica.js";

import Memoria from "../components/info/Memoria.js";
import Subtipo from "../components/info/Subtipo.js";
import Adjunto from "../components/info/Adjunto.js";

import Urgencia from "../../core/components/layouts/Urgencia.js";
import Firmas from "../../core/components/layouts/Firmas.js";
import Solicitud from "../../core/modules/solicitud.js";
import tables from "../components/tables/tables.js";

class Presto extends Solicitud {
	#DATA = {}; // creation container

	getSolicitudes = () => tables.getSolicitudes(); // tabla de solicitudes
	getPartidas = () => tables.get("partidas"); // tabla de partidas a incrementar

	init() { // init modules
		this.#DATA.ejercicios = this.getElement("ej").getValues(); // read current open years
		this.getPartidas().set("#doc030", this.getElement("eco030").view); // view 030 handler
		return super.init();
	}

	onView(data) {
		this.getElement("ej").setLabels(data.ejercicios); // load ejercicios
		this.getPartidas().render(data.partidas); // cargo la tabla de partidas a incrementar
	}

	create(tipo, memo) {
		this.#DATA.solicitud = { tipo, memo };
		delete this.#DATA.partidas;
		super.create(this.#DATA);
	}
	createTcr() { this.create(1); } // create TCR
	createFce() { this.create(6); } // create FCE
	createL83() { this.create(3, "Liquidación contrato artículo 83"); } // create L83
	createGcr() { this.create(4, "Generación de crédito electrónica"); } // create GCR
	createAnt() { this.create(5); } // create ANT
	createAfc() { // set partida unica + view
		this.#DATA.solicitud = { tipo: 8 };
		if (this.#DATA.fcb) { // aplicación fondo de cobertura
			this.#DATA.partidas = [ this.#DATA.fcb ];
			return super.create(this.#DATA);
		}
		api.init().json("/uae/presto/fcb").then(fcb => {
			this.#DATA.fcb = fcb; // avoid extra calls
			this.#DATA.partidas = [ this.#DATA.fcb ];
			super.create(this.#DATA); // load view AFC
		});
	}

	setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item.int) && (presto.isTcr() || presto.isFce()) && this.showInfo(info);
		return this;
	}

	getFormData() {
		const fd = super.getFormData(); // append all input values
		fd.load(presto.getData(), [ "id", "estado", "tipo", "mask", "codigo" ]); // set calculated fields
		fd.exclude([ "faDec", "cd", "ejInc", "faInc", "impInc", "ej030", "imp030" ]); // remove extra fields
		// primera partida = principal y serializo el json (FormData only supports flat values)
		return fd.setJSON("partidas", this.getPartidas().setPrincipal().getData());
	}
}

customElements.define("ej-dec", Ejercicio, { extends: "select" });
customElements.define("organica-inc", OrganicaInc, { extends: "input" });
customElements.define("add-partida-inc", AddPartida, { extends: "button" });
customElements.define("organica-030", Organica030, { extends: "input" });

customElements.define("memo-text", Memoria, { extends: "textarea" });
customElements.define("gcr-list", Subtipo, { extends: "select" });
customElements.define("btn-doc", Adjunto, { extends: "button" });

customElements.define("urgencia-list", Urgencia, { extends: "select" });
customElements.define("firmas-block", Firmas, { extends: "div" });

export default new Presto();
