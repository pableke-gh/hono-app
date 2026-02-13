
import api from "../../components/Api.js"
import presto from "../model/Presto.js";
import pInc from "./partidaInc.js";
import partidas from "./partidas.js";
import Form from "./form.js";

class PartidaDec extends Form {
	#orgDec = this.setAutocomplete("#acOrgDec");
	#ecoDec = this.setDatalist("#idEcoDec");

	constructor() {
		super(); // call super before to use this reference

		const fnSource = term => {
			const opts = { 3: "/uae/presto/organicas/l83", 5: "/uae/presto/organicas/ant" };
			const url = opts[presto.getTipo()] || "/uae/presto/organicas/dec"; // default url
			api.init().json(url, { ej: this.getval("#ejDec"), term }).then(this.#orgDec.render);
		}
		const fnSelectOrgDec = item => { //select
			presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
			const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
			api.init().json(url + "?org=" + item.value).then(this.#ecoDec.setItems); // this.#ecoDec.setItems => auto call fnEcoChange (economica change event)
			this.setAvisoFa(item).setValue("#faDec", item.int & 1); // indicador de organica afectada
		}
		const fnResetOrgDec = () => { // reset organica a decrementar
			presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
			this.setValue("#faDec");
			this.#ecoDec.reset();
		}
		this.#orgDec.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelectOrgDec).setReset(fnResetOrgDec);

		const fnAutoloadErr = msg => { this.#orgDec.isItem() && this.showError(msg); }
		const fnAutoloadL83 = data => { data ? pInc.autoload(data, this.#ecoDec.getItem(0).imp) : fnAutoloadErr("Aplicación AIP no encontrada en el sistema."); }
		const fnAutoloadAnt = data => { data ? pInc.autoload(data, Math.max(0, data.ih)) : fnAutoloadErr("No se ha encontrado el anticipo en el sistema."); }

		const fnEcoChange = item => {
			this.setValue("#cd", item.imp);
			if (presto.isL83() && presto.isEditable()) //L83 => busco su AIP solo en edicion
				return api.init().json(`/uae/presto/l83?org=${this.#orgDec.getValue()}`).then(fnAutoloadL83);
			if (presto.isAnt() && presto.isEditable()) //ANT => cargo misma organica solo en edicion
				return api.init().json(`/uae/presto/anticipo?org=${this.#orgDec.getValue()}&eco=${item.value}`).then(fnAutoloadAnt);
		}
		const fnEcoReset = () => this.setValue("#impDec").setValue("#cd");
		this.#ecoDec.setEmptyOption("Seleccione una económica").setChange(fnEcoChange).setReset(fnEcoReset);

		this.onChangeInput("#ejDec", this.#orgDec.reload);
		this.onChangeInput("#impDec", ev => { presto.isAutoLoadImp() && pInc.autoload(null, this.getValue(ev.target)); }); //importe obligatorio
		partidas.setRemove(() => { presto.isAutoLoadInc() && this.#orgDec.reload(); return Promise.resolve(); }); // force reload organica
	}

	view(data) {
		const solicitud = data.solicitud; // datos del servidor
		this.setLabels("select.ui-ej", data.ejercicios); // update field values
        this.#orgDec.setValue(solicitud.idOrgDec, solicitud.orgDec + " - " + solicitud.dOrgDec);
		this.#ecoDec.setItems(data.economicas); // cargo el desplegable de economicas
	}
}

export default new PartidaDec();
