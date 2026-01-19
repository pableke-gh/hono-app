
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

import p030 from "./partida030.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";
import partidas from "../model/Partidas.js";
import sf from "../../xeco/modules/SolicitudForm.js";

function PartidaInc() {
	const self = this; //self instance
	const form = sf.getForm(); // form component

	const _ecoInc = form.setDatalist("#idEcoInc");
	_ecoInc.setEmptyOption("Seleccione una económica");

	const fnSelect = item => {
		form.setValue("#faInc", item.int & 1); // organica afectada
		api.init().json("/uae/presto/economicas/inc?org=" + item.value).then(_ecoInc.setItems); // load economicas inc.
		self.setAvisoFa(item); // aviso para organicas afectadas en TCR o FCE
	}
	const _acOrgInc = form.setAutocomplete("#acOrgInc");
	const fnSource = term => {
		const url = presto.isGcr() ? "/uae/presto/organicas/inc/gcr" : "/uae/presto/organicas/inc"; // url by type
		api.init().json(url, { ej: form.getval("#ejInc"), term }).then(_acOrgInc.render); // send fetch
	}
	const fnReset = () => { form.setValue("#faInc").setValue("#impInc"); _ecoInc.reset(); }
	_acOrgInc.setItemMode(4).setSource(fnSource).setAfterSelect(fnSelect).setReset(fnReset);

	const _tblPartidasInc = form.setTable("#partidas-inc", partida.getTable());
	_tblPartidasInc.setMsgEmpty("No existen partidas asociadas a la solicitud");
	_tblPartidasInc.setAfterRender(() => { partidas.setData(_tblPartidasInc); form.setEditable(presto); });

	this.getTable = () => _tblPartidasInc;
	this.setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
		const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
		partida.isAfectada(item?.int) && (presto.isTcr() || presto.isFce()) && form.showInfo(info);
    }
	this.autoload = (partida, imp) => {
		partida = partida || _tblPartidasInc.getFirst();
		if (!partida) // compruebo si existe partida a incrementar
			return !form.showError("No se ha seleccionado una partida a incrementar");
		partida.imp = imp || 0; //propone un importe
		_tblPartidasInc.render([ partida ]); //render partida unica
		form.setValue("#impDec", partida.imp);
		p030.autoload(partida, imp);
	}

	this.init = () => { // init. partidas view
		_tblPartidasInc.set("#doc030", p030.view);
		const fnEditableEjDec = () => _tblPartidasInc.isEmpty();
		const fnEditableEjInc = () => (fnEditableEjDec() && !presto.isDisableEjInc());
		form.set("is-editable-ej-dec", fnEditableEjDec).set("is-editable-ej-inc", fnEditableEjInc).onChangeInput("#ejInc", _acOrgInc.reload);
	}

	this.view = partidas => {
		_ecoInc.reset(); // clear select box
		_tblPartidasInc.render(partidas); // load table
	}

	tabs.setAction("partida-inc-add", () => {
		if (!form.validate(partida.validate))
			return false; // Errores al validar las partidas
		const url = `/uae/presto/partida/add?org=${_acOrgInc.getValue()}&eco=${_ecoInc.getValue()}`;
		api.init().json(url).then(partidaInc => { // fetch partida a incrementar
			if (!partidas.validatePartida(partidaInc))
				return form.setErrors(); // error en la partida a incrementar
			partidaInc.imp030 = partidaInc.imp = form.valueOf("#impInc"); // Importe de la partida a añadir
			_tblPartidasInc.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
			_acOrgInc.reload(); // reseteo los valores del formulario
		});
	});
	tabs.setAction("save030", () => {
		partida.setData(_tblPartidasInc.getCurrentItem()); // load partida actual
		if (!form.validate(p030.validate, ".ui-030")) // validate partida 080 / 030
			return false; // not valid data
		if (presto.isEditable()) // if editable => back to presto view, send table on tab-action-send
			return tabs.backTab().showOk("Datos del documento 030 asociados correctamente.");
		api.setJSON(_tblPartidasInc.getData()).json("/uae/presto/save/030").then(tabs.showForm);
	});
}

export default new PartidaInc();
