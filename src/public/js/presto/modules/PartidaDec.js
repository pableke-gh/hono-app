
import api from "../../components/Api.js"
import pInc from "./partidaInc.js";
import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function PartidaDec() {
	//const self = this; //self instance
	const form = xeco.getForm(); // form component
	const partidas = pInc.getTable(); // table partidas

	const fnAutoloadErr = msg => { _orgDec.isItem() && form.showError(msg); }
	const fnAutoloadL83 = data => { data ? pInc.autoload(data, _ecoDec.getItem(0).imp) : fnAutoloadErr("Aplicación AIP no encontrada en el sistema."); }
	const fnAutoloadAnt = data => { data ? pInc.autoload(data, Math.max(0, data.ih)) : fnAutoloadErr("No se ha encontrado el anticipo en el sistema."); }

	const fnSelectOrgDec = item => { //select
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setValue("#faDec", item.int & 1); // campo de organica afectada
		// _ecoDec.setItems => auto call fnEcoChange (economica change event)
		api.init().json(`/uae/presto/economicas/dec?org=${item.value}`).then(_ecoDec.setItems);
		pInc.setAvisoFa(item); //aviso para organicas afectadas en TCR o FCE
	}
	const fnResetOrgDec = () => { // reset organica a decrementar
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setValue("#faDec");
		_ecoDec.reset();
	}
	const _orgDec = form.setAutocomplete("#acOrgDec");
	const fnSource = term => api.init().json(`/uae/presto/organicas/dec?ej=${form.getval("#ejDec")}&term=${term}`).then(_orgDec.render);
	_orgDec.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelectOrgDec).setReset(fnResetOrgDec);

	const fnEcoChange = item => {
		form.setValue("#idEcoDecPF", item.value).setValue("#cd", item.imp);
		if (presto.isL83() && presto.isEditable()) //L83 => busco su AIP solo en edicion
			return api.init().json(`/uae/presto/l83?org=${_orgDec.getValue()}`).then(fnAutoloadL83);
		if (presto.isAnt() && presto.isEditable()) //ANT => cargo misma organica solo en edicion
			return api.init().json(`/uae/presto/anticipo?org=${_orgDec.getValue()}&eco=${item.value}`).then(fnAutoloadAnt);
	}

	const _ecoDec = form.setDatalist("#idEcoDec");
	const fnEcoReset = () => form.setValue("#impDec").setValue("#cd");
	_ecoDec.setEmptyOption("Seleccione una económica").setChange(fnEcoChange).setReset(fnEcoReset);

	this.init = () => { // Init. form events
		form.onChangeInput("#ejDec", _orgDec.reload);
		form.onChangeInput("#impDec", ev => { presto.isAutoLoadImp() && pInc.autoload(null, form.getValue(ev.target)); }); //importe obligatorio
		partidas.setRemove(() => (presto.isAutoLoadInc() ? _orgDec.reload() : true)); // force reload organica
	}

	this.view = (data, economicas) => {
        _orgDec.setValue(data.idOrgDec, data.orgDec + " - " + data.dOrgDec);
		_ecoDec.setItems(economicas);
	}
}

export default new PartidaDec();
