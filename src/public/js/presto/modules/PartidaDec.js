
import Form from "../../components/forms/Form.js";
import api from "../../components/Api.js"
import presto from "../model/Presto.js";
import form from "./presto.js";

export default class PartidaDec extends Form {
	#orgDec = this.setAutocomplete("#acOrgDec");
	#ecoDec = this.getElement("idEcoDec"); //data-list

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		const pInc = form.getPartidaInc();
		const partidas = pInc.getPartidas();

		const fnSource = term => {
			const opts = { 3: "/uae/presto/organicas/l83", 5: "/uae/presto/organicas/ant" };
			const url = opts[presto.getTipo()] || "/uae/presto/organicas/dec"; // default url
			api.init().json(url, { ej: this.getValue("ej"), term }).then(this.#orgDec.render);
		}
		const fnSelectOrgDec = item => { //select
			presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
			const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
			api.init().json(url + "?org=" + item.value).then(this.#ecoDec.setItems); // this.#ecoDec.setItems => auto call fnEcoChange (economica change event)
			form.setAvisoFa(item).setValue("faDec", item.int & 1); // indicador de organica afectada
		}
		const fnResetOrgDec = () => { // reset organica a decrementar
			presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
			this.setValue("faDec");
			this.#ecoDec.clear();
		}
		this.#orgDec.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelectOrgDec).setReset(fnResetOrgDec);

		const fnAutoloadErr = msg => { this.#orgDec.isItem() && this.showError(msg); }
		const fnAutoloadL83 = data => { data ? pInc.autoload(data, this.#ecoDec.getItem(0).imp) : fnAutoloadErr("Aplicación AIP no encontrada en el sistema."); }
		const fnAutoloadAnt = data => { data ? pInc.autoload(data, Math.max(0, data.ih)) : fnAutoloadErr("No se ha encontrado el anticipo en el sistema."); }

		const fnEcoChange = () => {
			if (this.#ecoDec.isEmpty())
				return this.setValue("impDec").setValue("cd");;
			const item = this.#ecoDec.getCurrent();
			this.setValue("cd", item.imp); // set importe
			if (presto.isL83() && presto.isEditable()) //L83 => busco su AIP solo en edicion
				return api.init().json(`/uae/presto/l83?org=${this.#orgDec.getValue()}`).then(fnAutoloadL83);
			if (presto.isAnt() && presto.isEditable()) //ANT => cargo misma organica solo en edicion
				return api.init().json(`/uae/presto/anticipo?org=${this.#orgDec.getValue()}&eco=${item.value}`).then(fnAutoloadAnt);
		}
		this.#ecoDec.setEmptyOption("Seleccione una económica").addChange(fnEcoChange);

		this.addChange("ej", this.#orgDec.reload);
		this.addChange("impDec", ev => { presto.isAutoLoadImp() && pInc.autoload(null, this.getValue(ev.target)); }); //importe obligatorio
		partidas.setRemove(() => { presto.isAutoLoadInc() && this.#orgDec.reload(); return Promise.resolve(); }); // force reload organica
	}

	view(data) {
		const solicitud = data.solicitud; // datos del servidor
		this.setLabels("select.ui-ej", data.ejercicios); // update field values
        this.#orgDec.setValue(solicitud.idOrgDec, solicitud.orgDec + " - " + solicitud.dOrgDec);
		this.#ecoDec.setItems(data.economicas); // cargo el desplegable de economicas
	}
}
