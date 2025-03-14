
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";

import mpresto from "./presto.js";
import p030 from "./partida030.js";
import presto from "../model/Presto.js";

function PartidaInc() {
	const self = this; //self instance
	const form = mpresto.getForm(); // form component
	const partida = presto.getPartida();
	const partidas = presto.getPartidas();

	const _acOrgInc = form.setAcItems("#acOrgInc", //selector
									term => window.rcFindOrgInc(pf.param("term", term)), //source
									item => { form.setval("#faInc", item.int & 1); pf.sendId("rcEcoInc", item.value); }, //select
									() => { form.setval("#faInc").setval("#impInc"); pf.sendId("rcEcoInc"); }); //reset
	const _ecoInc = pf.datalist(form, "#idEcoInc", "#idEcoIncPF", { emptyOption: "Seleccione una económica" });
	const _partidasInc = form.setTable("#partidas-inc", partida.getTable());
	_partidasInc.setMsgEmpty("No existen partidas asociadas a la solicitud");
	_partidasInc.setAfterRender(resume => {
		partidas.setData(_partidasInc);
		const readonly = resume.size > 0;
		form.readonly(readonly, "#ejDec").readonly(readonly || presto.isDisableEjInc(), "#ejInc").setVisible(".show-partida-inc", presto.showPartidasInc());
	});

    this.getOrganica = () => _acOrgInc;
    this.getEconomica = () => _ecoInc;
    this.setEconomicas = economicas => { _ecoInc.setItems(economicas); return self; }
    this.getPartidas = () => _partidasInc;
    this.setPartidas = partidas => { _partidasInc.render(partidas); return self; }

    this.autoload = (partida, imp) => {
        partida.imp = imp || 0; //propone un importe
        _partidasInc.render([ partida ]); //render partida unica
        form.setval("#impDec", partida.imp);
		return self;
    }
    this.autoload030 = imp => {
		p030.autoload(_partidasInc.getData(), imp);
		return self;
	}

    this.validate = () => {
		partidas.setData(_partidasInc); // Cargo las partidas para su validación
		if (!form.validate(presto.validate))
			return false; // Errores al validar las partidas
		partidas.setPrincipal(); //marco la primera como principal
		form.saveTable("#partidas-json", _partidasInc); // save data to send to server
		return self;
    }

	this.init = () => {
		_ecoInc.reset(); // init. form presto
		form.onChangeInput("#urgente", ev => form.setVisible(".grp-urgente", ev.target.value == "2"))
			.onChangeInput("#ejInc", _acOrgInc.reload);

		// init. form 030
		const form030 = p030.getForm();
		_partidasInc.set("#doc030", p030.load);
		form030.addClick("#save-030", ev => { // Init. save 030 event
			partida.setData(_partidasInc.getCurrentItem()); // partida actual
			if (!form030.validate(p030.validate)) // valida entrada
				return false; // Errores al validar el 030
			form.saveTable("#partidas-json", _partidasInc); // save data to send to server
			if (presto.isFinalizada())
				form.click("#save030"); // actualizo los datos a integrar
			else
				tabs.backTab().showOk("Datos del documento 030 asociados correctamente."); // Back to presto view
		});
		return self;
	}

	//****** tabla de partidas a incrementar ******//
	window.fnAddPartidaInc = () => form.validate(partida.validate);
	window.loadPartidaInc = (xhr, status, args) => {
		const partidaInc = JSON.read(args.data);
		form.closeAlerts().hide(".link-adjunto");
		if (!partidas.setData(_partidasInc).validatePartida(partidaInc))
			return form.setErrors(); // error en la partida a incrementar
		partidaInc.imp030 = partidaInc.imp = form.valueOf("#impInc"); // Importe de la partida a añadir
		_partidasInc.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
		_acOrgInc.reload();
	}
}

export default new PartidaInc();
