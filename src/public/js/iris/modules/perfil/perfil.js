
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";

import iris from "../../model/Iris.js";
import organicas from "./organicas.js";
import actividad from "./actividad.js";
import dietas from "../gastos/dietas.js";
import xeco from "../../../xeco/xeco.js";

function Perfil() {
	//const self = this; //self instance
	const form = xeco.getForm(); // form component
	const firmas = xeco.getFirmas(); // modulo de firmas

	const fnInteresado = interesado => (interesado.nif + " - " + interesado.nombre);
	const _acInteresado = form.setAutocomplete("#interesado", { // autocomplete field
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		source: term => api.init().json("/uae/iris/interesados", { term }).then(_acInteresado.render),
		render: fnInteresado,
		select: item => { actividad.setColectivo(item); return item.nif; },
		onReset: () => actividad.setColectivo()
	});

	const _acPromotor = form.setAutocomplete("#promotor");
	const fnShowFirmas = data => firmas.view(data.firmas); // update firmas view
	const fnPromotor = term => api.init().json("/uae/iris/personal", { id: iris.getId(), term }).then(_acPromotor.render);
	const fnSelect = item => api.init().msgs("/uae/iris/promotor?id=" + iris.getId() + "&nif=" + item.value).then(fnShowFirmas);
	const fnReset = () => api.init().msgs("/uae/iris/promotor?id=" + iris.getId()).then(fnShowFirmas);
	_acPromotor.setItemMode(4).setSource(fnPromotor).setSelect(fnSelect).setReset(fnReset);

	this.isEmpty = () => (actividad.isEmpty() || organicas.isEmpty());
	this.getGrupoDieta = organicas.getGrupoDieta;
	this.getTipoDieta = organicas.getTipoDieta;
	this.isRutaUnica = actividad.isRutaUnica;
	this.isMaps = actividad.isMaps;

    const fnValidate = data => {
		const valid = form.getValidators();
		if (actividad.isEmpty() || !data.actividad)
        	valid.addRequired("acInteresado", "errPerfil");
		if (organicas.isEmpty())
			valid.addRequired("acOrganica", "errOrganicas");
		return valid.isOk();
    }

	form.afterReset(() => { _acInteresado.setValue(); actividad.setColectivo(); organicas.reset(); });
	tabs.setAction("create", () => api.init().json("/uae/iris/create").then(iris.view));
	tabs.setAction("paso0", () => {
		const data = form.validate(fnValidate);
		if (!data) return; // error => no hago nada
		if (!form.isChanged() && !organicas.isChanged())
			return tabs.nextTab(); // no cambios => salto a paso 1
		const temp = Object.assign(iris.getData(), data); // merge data to send
		if (organicas.isChanged()) // recalculo las dietas
			temp.gastos = dietas.build().getGastos();
		temp.organicas = organicas.getOrganicas(); // lista de organicas
		api.setJSON(temp).json("/uae/iris/save0").then(iris.update);
	});

	this.init = () => {
		actividad.init();
		organicas.init();

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => form.copyToClipboard(url));
		form.set("is-isu", actividad.isIsu).set("not-isu", () => !actividad.isIsu()).set("is-maps", actividad.isMaps);
	}

	this.view = (interesado, orgs, principales) => {
		iris.setInteresado(interesado); // 1º set interesado
		if (interesado) // si hay interesado => set field value
			_acInteresado.setValue(interesado.nif, fnInteresado(interesado));
		else // clear field value
			_acInteresado.setValue();
		organicas.setOrganicas(orgs); // 2º update financiacion
		const promotor = firmas.findByGrupo(5, principales); // 3º firma del promotor
		if (promotor)
			_acPromotor.setValue(promotor.nif, firmas.getFirmante(promotor)); // set field value
		else
			_acPromotor.setValue(); // clear field value
	}
}

export default new Perfil();
