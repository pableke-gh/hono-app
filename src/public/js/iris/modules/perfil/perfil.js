
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import organicas from "./organicas.js";
import actividad from "./actividad.js";
import xeco from "../../../xeco/xeco.js";

function Perfil() {
	//const self = this; //self instance
	const form = xeco.getForm(); // form component

	const fnRender = interesado => (interesado.nif + " - " + interesado.nombre);
	const _acInteresado = form.setAutocomplete("#interesado", { // autocomplete field
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		source: term => api.init().json("/uae/iris/interesados", { term }).then(_acInteresado.render),
		render: fnRender,
		select: item => { actividad.setColectivo(item); return item.nif; },
		onReset: () => actividad.setColectivo()
	});

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
		temp.organicas = organicas.getOrganicas(); // lista de organicas
		api.setJSON(temp).json("/uae/iris/save0").then(iris.update);
	});

	this.init = () => {
		actividad.init();
		organicas.init();

		const acPromotor = form.setAutocomplete("#promotor");
		const fnPromotor = term => api.init().json("/uae/iris/personal", { id: iris.getId(), term }).then(acPromotor.render);
		acPromotor.setItemMode(4).setSource(fnPromotor);

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => form.copyToClipboard(url));
		form.set("is-isu", actividad.isIsu).set("not-isu", () => !actividad.isIsu()).set("is-maps", actividad.isMaps);

		// render steps functions
		iris.getPaso1 = () => i18n.render(i18n.set("paso", 1).get("lblPasos"), iris);
		iris.getPaso = () => i18n.render(i18n.set("paso", i18n.get("paso") + 1).get("lblPasos"), iris);
		iris.getPasoIsu = () => i18n.render(i18n.set("paso", i18n.get("paso") + actividad.isIsu()).get("lblPasos"), iris);
	}

	this.view = (interesado, orgs) => {
		iris.setInteresado(interesado); // 1º set interesado
		if (interesado) // si hay interesado => set field value
			_acInteresado.setValue(interesado.nif, fnRender(interesado));
		else // clear field value
			_acInteresado.setValue(); 
		organicas.setOrganicas(orgs); // 2º update financiacion
	}
}

export default new Perfil();
