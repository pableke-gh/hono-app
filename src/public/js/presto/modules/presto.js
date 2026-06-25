
import tabs from "../../core/components/helpers/Tabs.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";

import PartidaDec from "./PartidaDec.js";
import Partida030 from "./Partida030.js";

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
	#p030 = new Partida030(this);
	#partidas = this.querySelector("table");

	connectedCallback() {
		super.connectedCallback(); // initialize form
		presto.setUser(this.dataset); // load user info
		this.addChange("imp", ev => { // autoload importe
			presto.isAutoLoadImp() && this.getPartidas().setImp(ev.target.getValue());
		});

		this.getElementsByClassName(this.dataset.loadedClass).forEach(el => {
			const template = el.innerHTML; // save template
			const fnUpdate = () => { el.innerHTML = presto.render(template); };
			observer.subscribe(this.dataset.loadedClass, fnUpdate);
		});

		this.#p030.init();
	}

	onView(data) {
		this.#partidas.render(data.partidas); // cargo la tabla de partidas a incrementar
	}
	#load(firmas) {
		Firmas.notify(firmas);
		tabs.showForm(); // show form tab
	}	
	create(data) {
		presto.setData(data.solicitud); // set default data
		this.elements.ej.setLabels(data.ejercicios); // set ejercicios
		super.create(presto.getData()).#load(); // load form with default data
	}
	load = row => {
		const fnLoad = (data, firmas) => {
			const editable = presto.setData(data).isEditable(); // check if data is editable
			super.load(data, editable).#load(firmas); // load form with data
		}

		if (this.isCached(row.id)) // check if data is cached
			return fnLoad(row, true); // go form tab directly
		const url = `/uae/presto/view?id=${row.id}&a=${row.apli}`; // resource
		api.init().json(url).then(data => { // server response
			this.elements.ej.setLabels(data.ejercicios); // set ejercicios
			fnLoad(Object.assign(row, data.solicitud), data.firmas); // show firmas list
		});
	}

	close = firmas => {
		this.isCached(presto.getId()) && Firmas.notify(firmas);
		this.getTable().showList(); // show list tab
	}
	reject = row => {
		super.update(row, presto.setData(row).isEditable()); // load form with data
		Firmas.notify(this.isCached(row.id));
		tabs.show("reject");
	}

	getSolicitudes = () => window.solicitudes; // tabla de solicitudes
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

customElements.define("ej-dec", Ejercicio, { extends: "select" });
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
