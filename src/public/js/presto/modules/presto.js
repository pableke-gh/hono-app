
import valid from "../i18n/validators.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

import AddPartida from "../components/inc/AddPartida.js";
import OrganicaInc from "../components/inc/Organica.js";
import Partidas from "../components/inc/Partidas.js";
import Organica030 from "../components/p030/Organica.js";

import Memoria from "../components/info/Memoria.js";
import Subtipo from "../components/info/Subtipo.js";
import Adjunto from "../components/info/Adjunto.js";

import Urgencia from "../../core/components/layouts/Urgencia.js";
import Firmas from "../../core/components/layouts/Firmas.js";

import Solicitud from "../../core/modules/solicitud.js";
import PrestoSolicitudes from "./prestos.js";

class Presto extends Solicitud {
	#partidas = this.querySelector("table");

	init() { // init modules
		super.init(valid); // load validators
		this.#partidas.set("#doc030", this.getElement("eco030").view);
		return this;
	}

	onView(data) {
		this.getElement("ej").setLabels(data.ejercicios); // load ejercicios
		this.#partidas.render(data.partidas); // cargo la tabla de partidas a incrementar
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
	getPartidas = () => this.#partidas; // tabla de partidas a incrementar

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

customElements.define("organica-inc", OrganicaInc, { extends: "input" });
customElements.define("add-partida-inc", AddPartida, { extends: "button" });
customElements.define("partidas-table", Partidas, { extends: "table" });
customElements.define("organica-030", Organica030, { extends: "input" });

customElements.define("memo-text", Memoria, { extends: "textarea" });
customElements.define("gcr-list", Subtipo, { extends: "select" });
customElements.define("btn-doc", Adjunto, { extends: "button" });

customElements.define("urgencia-list", Urgencia, { extends: "select" });
customElements.define("firmas-block", Firmas, { extends: "div" });
customElements.define("presto-table", PrestoSolicitudes, { extends: "table" });

export default new Presto();
