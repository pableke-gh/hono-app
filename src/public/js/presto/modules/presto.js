
import valid from "../i18n/validators.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

import PartidaDec from "./partidaDec.js";
import Partida030 from "./partida030.js";

import AddPartida from "../components/inc/AddPartida.js";
import OrganicaInc from "../components/inc/Organica.js";
import Partidas from "../components/inc/Partidas.js";

import Memoria from "../components/info/Memoria.js";
import Subtipo from "../components/info/Subtipo.js";
import Adjunto from "../components/info/Adjunto.js";

import FormHTML from "../../core/components/forms/Form.js";
import ButtonSave from "../components/buttons/Save.js";
import ButtonSubsanar from "../components/buttons/Subsanar.js";
import Urgencia from "../../core/components/layouts/Urgencia.js";
import Firmas from "../../core/components/layouts/Firmas.js";

export default class PrestoForm extends FormHTML {
	#pDec = new PartidaDec(this);
	#p030 = new Partida030(this);
	#partidas = this.querySelector("table");

	connectedCallback() {
		super.connectedCallback(); // initialize form
		presto.setUser(this.dataset); // load user info
		this.getElementsByClassName(this.dataset.loadedClass).forEach(el => {
			const template = el.innerHTML; // save template
			const fnUpdate = () => { el.innerHTML = presto.render(template); };
			observer.subscribe(this.dataset.loadedClass, fnUpdate);
		});

		this.#pDec.init();
		this.#p030.init();
	}

	onView(data) {
		this.#pDec.view(data); // cargo el formulario de la partida a decrementar
		this.#partidas.render(data.partidas); // cargo la tabla de partidas a incrementar
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
	getPartidaDec = () => this.#pDec; // partida que se decrementa
	getPartida030 = () => this.#p030; // formulario del DC 030
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

customElements.define("memo-text", Memoria, { extends: "textarea" });
customElements.define("gcr-list", Subtipo, { extends: "select" });
customElements.define("btn-doc", Adjunto, { extends: "button" });

customElements.define("urgencia-list", Urgencia, { extends: "select" });
customElements.define("firmas-block", Firmas, { extends: "div" });

customElements.define("btn-save", ButtonSave, { extends: "button" });
customElements.define("btn-subsanar", ButtonSubsanar, { extends: "button" });
