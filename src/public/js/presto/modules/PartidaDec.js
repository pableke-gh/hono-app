
import FormBase from "../../components/forms/FormBase.js";
import api from "../../components/Api.js"
import presto from "../model/Presto.js";
import OrganicaDec from "./inputs/OrganicaDec.js";
import form from "./presto.js";

export default class PartidaDec extends FormBase {
	#organica = this.getElement("orgDec"); // autocomplete
	#economica = this.getElement("ecoDec"); // data-list

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		const pInc = form.getPartidaInc();
		const partidas = pInc.getPartidas();

		this.#organica.select = item => { // override => final select
			presto.isAutoLoadInc() && partidas.reset(); //autoload => clear table
			const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
			api.init().json(url + "?org=" + item.value).then(this.#economica.setItems); // auto load on economica change event
			form.setAvisoFa(item).setValue("faDec", item.int & 1); // indicador de organica afectada
			return item.value;
		}
		this.#organica.addListener("reset", () => { // reset organica a decrementar
			presto.isAutoLoadInc() && partidas.reset(); //autoload => clear table
			this.#economica.clear();
			this.setValue("faDec");
		});

		const fnAutoloadErr = msg => { this.#organica.isItem() && this.showError(msg); }
		const fnAutoloadL83 = data => { data ? pInc.autoload(data, this.#economica.getItem(0).imp) : fnAutoloadErr("Aplicación AIP no encontrada en el sistema."); }
		const fnAutoloadAnt = data => { data ? pInc.autoload(data, Math.max(0, data.ih)) : fnAutoloadErr("No se ha encontrado el anticipo en el sistema."); }
		this.#economica.setEmptyOption("Seleccione una económica").addChange(() => {
			if (this.#economica.isEmpty())
				return this.setValue("impDec").setValue("cd");
			const item = this.#economica.getCurrent();
			this.setValue("cd", item.imp); // set importe
			if (presto.isL83() && presto.isEditable()) //L83 => busco su AIP solo en edicion
				return api.init().json(`/uae/presto/l83?org=${this.#organica.getValue()}`).then(fnAutoloadL83);
			if (presto.isAnt() && presto.isEditable()) //ANT => cargo misma organica solo en edicion
				return api.init().json(`/uae/presto/anticipo?org=${this.#organica.getValue()}&eco=${item.value}`).then(fnAutoloadAnt);
		});

		this.addChange("ej", this.#organica.reload);
		this.addChange("impDec", ev => { presto.isAutoLoadImp() && pInc.autoload(null, ev.target.getValue()); }); //importe obligatorio
	}

	view(data) {
		const solicitud = data.solicitud; // datos del servidor
		this.setLabels("select.ui-ej", data.ejercicios).setValue("faDec", solicitud.omask & 1).setValue("impDec", solicitud.imp);
        this.#organica.setValue(solicitud.idOrgDec, solicitud.orgDec + " - " + solicitud.dOrgDec);
		this.#economica.setItems(data.economicas); // cargo el desplegable de economicas
	}
	reload() {
		this.#organica.reload();
	}
}

customElements.define("organica-dec", OrganicaDec, { extends: "input" });
