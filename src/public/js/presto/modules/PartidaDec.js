
import coll from "../../components/CollectionHTML.js";
import pf from "../../components/Primefaces.js";

import pInc from "./partidaInc.js";
import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function PartidaDec() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const partidas = pInc.getPartidas();

	const fnSelectOrgDec = item => { //select
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setval("#faDec", item.int & 1).loading();
		window.rcEcoDec();
	}
	const fnResetOrgDec = () => { // reset
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setval("#faDec");
		window.rcEcoDec();
	}
	const fnSource = () => window.rcFindOrgDec(); //source
	const _orgDec = form.setAcItems("#acOrgDec", fnSource, fnSelectOrgDec, fnResetOrgDec);

	const fnEcoChange = item => form.setval("#cd", item.imp);
	const fnEcoReset = () => form.setval("#impDec").setval("#cd");
	const _ecoOpts = { emptyOption: "Seleccione una económica", onChange: fnEcoChange, onReset: fnEcoReset };
	const _ecoDec = pf.datalist(form, "#idEcoDec", "#idEcoDecPF", _ecoOpts);

    this.getOrganica = () => _orgDec
    this.setOrganica = (id, txt) => { _orgDec.setValue(id, txt); return self; }
	this.setEconomica = economicas => { _ecoDec.setItems(economicas); return self; }

	this.init = () => { // Init. form events
		form.onChangeInput("#ejDec", _orgDec.reload);
		form.onChangeInput("#idEcoDec", ev => {
			if (presto.isL83()) //L83 => busco su AIP
				form.click("#autoload-l83");
			else if (presto.isAnt()) //ANT => cargo misma organica
				form.click("#autoload-ant");
		});
		form.onChangeInput("#impDec", ev => {
			if (presto.isAutoLoadImp()) //importe obligatorio
				pInc.autoload(null, form.getValue(ev.target));
		});
		partidas.setRemove(() => {
			if (presto.isAutoLoadInc())
				_orgDec.reload(); // force reload organica
			return true;
		});
	}

	this.view = (data, economicas) => {
        self.setOrganica(data.idOrgDec, data.orgDec + " - " + data.dOrgDec).setEconomica(economicas);
	}

    window.autoloadL83 = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		const data = coll.parse(args?.data);
		if (data)
			pInc.autoload(data, _ecoDec.getItem(0).imp);
		else if (_orgDec.isItem())
			form.showError("Aplicación AIP no encontrada en el sistema.");
    }
    window.autoloadAnt = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
        const data = coll.parse(args?.data);
        if (data) //hay partida?
            pInc.autoload(data, Math.max(0, data.ih));
        else if (_orgDec.isItem())
			form.showError("No se ha encontrado el anticipo en el sistema.");
    }
    window.loadEconomicasDec = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		self.setEconomica(coll.parse(args.economicas)); // carga las econonomicas a decrementar
		if (presto.isL83()) //L83 => busco su AIP
			window.autoloadL83(xhr, status, args);
		else if (presto.isAnt()) //ANT => cargo misma organica
			window.autoloadAnt(xhr, status, args);
		pInc.setAvisoFa(_orgDec.getCurrentItem()); //aviso para organicas afectadas en TCR o FCE
    }
}

export default new PartidaDec();
