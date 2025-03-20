
import coll from "../../components/CollectionHTML.js";
import alerts from "../../components/Alerts.js";
import pf from "../../components/Primefaces.js";

import pInc from "./partidaInc.js";
import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function PartidaDec() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const partidas = pInc.getPartidas();

	const fnSelectOrgDec = item => {
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setval("#faDec", item.int & 1);
		pf.sendId("rcEcoDec", item.value);
	}
	const fnResetOrgDec = () => {
		presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
		form.setval("#faDec");
		pf.sendId("rcEcoDec");
	}
	const _orgDec = form.setAcItems("#acOrgDec", //selector
									term => window.rcFindOrgDec(pf.param("term", term)), //source
									fnSelectOrgDec, //select
									fnResetOrgDec); //reset

	const _ecoDec = pf.datalist(form, "#idEcoDec", "#idEcoDecPF", {
								emptyOption: "Seleccione una económica",
								onChange: item => form.setval("#cd", item.imp),
								onReset: () => form.setval("#impDec").setval("#cd")});

    this.getOrganica = () => _orgDec
    this.setOrganica = (id, txt) => { _orgDec.setValue(id, txt); return self; }

	this.getEconomica = () => _ecoDec;
	this.setEconomica = economicas => { _ecoDec.setItems(economicas); return self; }
	this.setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const partida = presto.getPartida();
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item?.int) && (presto.isTcr() || presto.isFce()) && form.showInfo(info);
		alerts.working(); // Hide loading indicator
		return self;
    }

	this.init = () => {
		form.onChangeInput("#ejDec", ev => { form.setval("#ejInc", ev.target.value); _orgDec.reload(); }); 
		form.onChangeInput("#idEcoDec", ev => {
			if (presto.isL83()) //L83 => busco su AIP
				form.click("#autoload-l83");
			else if (presto.isAnt()) //ANT => cargo misma organica
				form.click("#autoload-ant");
		});
		form.onChangeInput("#impDec", ev => pInc.autoload030(form.getValue(ev.target))); //importe obligatorio 
		pf.uploads(form.querySelectorAll(".pf-upload"));
		return self;
	}

    window.autoloadL83 = (xhr, status, args) => {
		const data = coll.parse(args?.data);
		if (data)
			pInc.autoload(data, _ecoDec.getItem(0).imp);
		else if (_orgDec.isItem())
			form.showError("Aplicación AIP no encontrada en el sistema.");
    }
    window.autoloadAnt = (xhr, status, args) => {
        const data = coll.parse(args?.data);
        if (data) //hay partida?
            pInc.autoload(data, Math.max(0, data.ih));
        else if (_orgDec.isItem())
			form.showError("No se ha encontrado el anticipo en el sistema.");
    }
    window.loadEconomicasDec = (xhr, status, args) => {
		self.setEconomica(coll.parse(args.economicas)); // carga las econonomicas a decrementar
		if (presto.isL83()) //L83 => busco su AIP
			window.autoloadL83(xhr, status, args);
		else if (presto.isAnt()) //ANT => cargo misma organica
			window.autoloadAnt(xhr, status, args);
		self.setAvisoFa(_orgDec.getCurrentItem()); //aviso para organicas afectadas en TCR o FCE
    }
}

export default new PartidaDec();
