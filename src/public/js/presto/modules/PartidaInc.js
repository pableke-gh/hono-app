
import coll from "../../components/CollectionHTML.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";

import p030 from "./partida030.js";
import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function PartidaInc() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const partida = presto.getPartida();
	const partidas = presto.getPartidas();

	const fnSource = () => window.rcFindOrgInc();
	const fnSelect = item => { form.setval("#faInc", item.int & 1); window.rcEcoInc(); };
	const fnReset = () => { form.setval("#faInc").setval("#impInc"); window.rcEcoInc(); };
	const _acOrgInc = form.setAcItems("#acOrgInc", fnSource, fnSelect, fnReset);
	const _ecoInc = pf.datalist(form, "#idEcoInc", "#idEcoIncPF", { emptyOption: "Seleccione una económica" });

	const _tblPartidasInc = form.setTable("#partidas-inc", partida.getTable());
	_tblPartidasInc.setMsgEmpty("No existen partidas asociadas a la solicitud");
	_tblPartidasInc.setAfterRender(resume => { partidas.setData(_tblPartidasInc); form.setEditable(); });

	this.getOrganica = () => _acOrgInc;
	this.setEconomicas = economicas => { _ecoInc.setItems(economicas); return self; }
	this.getPartidas = () => _tblPartidasInc;
	this.setPartidas = partidas => { _tblPartidasInc.render(partidas); return self; }
	this.setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item?.int) && (presto.isTcr() || presto.isFce()) && form.showInfo(info);
		return self;
    }

	this.autoload = (partida, imp) => {
		partida = partida || _tblPartidasInc.getFirst();
		if (!partida) // compruebo si existe partida a incrementar
			return !form.showError("No se ha seleccionado una partida a incrementar");
		partida.imp = imp || 0; //propone un importe
		_tblPartidasInc.render([ partida ]); //render partida unica
		form.setval("#impDec", partida.imp);
		return p030.autoload(partida, imp);
	}

    this.validate = () => {
		//partidas.setData(_tblPartidasInc); // Cargo las partidas para su validación
		if (!form.validate(presto.validate))
			return false; // Errores al validar las partidas
		partidas.setPrincipal(); //marco la primera como principal
		return form.saveTable("#partidas-json", _tblPartidasInc); // save data to send to server
    }

	this.init = () => {
		// define validate action and init form view
		const fnEditableEjDec = () => _tblPartidasInc.isEmpty();
		const fnEditableEjInc = () => (fnEditableEjDec() && !presto.isDisableEjInc());
		form.set("is-valid", self.validate).onChangeInput("#ejInc", _acOrgInc.reload);
		form.set("is-editable-ej-dec", fnEditableEjDec).set("is-editable-ej-inc", fnEditableEjInc);
		_tblPartidasInc.set("#doc030", p030.load); // load form 030
	}

	this.view = partidas => {
		_ecoInc.reset(); // clear select box
		self.setPartidas(partidas); // load table
	}

	tabs.setAction("save030", () => {
		if (p030.save(_tblPartidasInc.getCurrentItem())) // partida actual
			form.saveTable("#partidas-json", _tblPartidasInc); // save data to send to server
	});

	//****** tabla de partidas a incrementar ******//
	window.loadEconomicasInc = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		self.setEconomicas(coll.parse(args?.data)); // load new items for economicas inc.
		self.setAvisoFa(_acOrgInc.getCurrentItem()); // aviso para organicas afectadas en TCR o FCE
	}
	window.fnAddPartidaInc = () => form.validate(partida.validate);
	window.loadPartidaInc = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		const partidaInc = coll.parse(args.data);
		if (!partidas/*.setData(_tblPartidasInc)*/.validatePartida(partidaInc))
			return form.setErrors(); // error en la partida a incrementar
		partidaInc.imp030 = partidaInc.imp = form.valueOf("#impInc"); // Importe de la partida a añadir
		_tblPartidasInc.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
		_acOrgInc.reload();
	}
	window.loadEco030 = (xhr, status, args) => {
		if (!window.showAlerts(xhr, status, args))
			return false; // Server error
		// carga las econonomicas de ingresos 030
		form.setItems("#idEco030", coll.parse(args.data));
		p030.view(_tblPartidasInc.getCurrentItem());
	}
}

export default new PartidaInc();
