
import api from "../../components/Api.js"
import presto from "../model/Presto.js";
import pInc from "./partidaInc.js";
import partidas from "./partidas.js";
import form from "../../xeco/modules/solicitud.js";

function PartidaDec() {
	const fnAutoloadErr = msg => { _orgDec.isItem() && form.showError(msg); }
	const fnAutoloadL83 = data => { data ? pInc.autoload(data, _ecoDec.getItem(0).imp) : fnAutoloadErr("Aplicación AIP no encontrada en el sistema."); }
	const fnAutoloadAnt = data => { data ? pInc.autoload(data, Math.max(0, data.ih)) : fnAutoloadErr("No se ha encontrado el anticipo en el sistema."); }

	const fnSelectOrgDec = item => { //select
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setValue("#faDec", item.int & 1); // indicador de organica afectada
		const url = presto.isAutoLoadInc() ? "/uae/presto/economicas/l83" : "/uae/presto/economicas/dec"; // url by type
		api.init().json(url + "?org=" + item.value).then(_ecoDec.setItems); // _ecoDec.setItems => auto call fnEcoChange (economica change event)
		pInc.setAvisoFa(item); //aviso para organicas afectadas en TCR o FCE
	}
	const fnResetOrgDec = () => { // reset organica a decrementar
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setValue("#faDec");
		_ecoDec.reset();
	}
	const _orgDec = form.setAutocomplete("#acOrgDec");
	const fnSource = term => {
		const opts = { 3: "/uae/presto/organicas/l83", 5: "/uae/presto/organicas/ant" };
		const url = opts[presto.getTipo()] || "/uae/presto/organicas/dec"; // default url
		api.init().json(url, { ej: form.getval("#ejDec"), term }).then(_orgDec.render);
	}
	_orgDec.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelectOrgDec).setReset(fnResetOrgDec);

	const fnEcoChange = item => {
		form.setValue("#cd", item.imp);
		if (presto.isL83() && presto.isEditable()) //L83 => busco su AIP solo en edicion
			return api.init().json(`/uae/presto/l83?org=${_orgDec.getValue()}`).then(fnAutoloadL83);
		if (presto.isAnt() && presto.isEditable()) //ANT => cargo misma organica solo en edicion
			return api.init().json(`/uae/presto/anticipo?org=${_orgDec.getValue()}&eco=${item.value}`).then(fnAutoloadAnt);
	}

	const _ecoDec = form.setDatalist("#idEcoDec");
	const fnEcoReset = () => form.setValue("#impDec").setValue("#cd");
	_ecoDec.setEmptyOption("Seleccione una económica").setChange(fnEcoChange).setReset(fnEcoReset);

	this.init = () => { // Init. form events
		pInc.init(); // tabla de partidas a incrementar
		form.onChangeInput("#ejDec", _orgDec.reload);
		form.onChangeInput("#impDec", ev => { presto.isAutoLoadImp() && pInc.autoload(null, form.getValue(ev.target)); }); //importe obligatorio
		partidas.setRemove(() => { presto.isAutoLoadInc() && _orgDec.reload(); return Promise.resolve(); }); // force reload organica
		presto.onView = this.view; // define specific presto view method
	}

	this.view = data => {
		const solicitud = data.solicitud; // datos del servidor
		form.setLabels("select.ui-ej", data.ejercicios); // update field values
        _orgDec.setValue(solicitud.idOrgDec, solicitud.orgDec + " - " + solicitud.dOrgDec);
		_ecoDec.setItems(data.economicas); // cargo el desplegable de economicas
		pInc.view(data.partidas); // cargo la tabla de partidas a incrementar
	}
}

export default new PartidaDec();
