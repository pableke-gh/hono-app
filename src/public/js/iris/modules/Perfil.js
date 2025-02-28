
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import iris from "./iris.js";
import dietas from "./dietas.js";
import actividad from "./actividad.js";
import organicas from "./organicas.js";

function Perfil() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.size = organicas.size;
	this.isEmpty = () => (actividad.isEmpty() || organicas.isEmpty());
	this.getGrupoDieta = organicas.getGrupoDieta;
	this.getTipoDieta = organicas.getTipoDieta;

	this.isMun = actividad.isMun;
	this.isIsu = actividad.isIsu;
	this.is1Dia = actividad.is1Dia;
	this.isTrayectos = actividad.isTrayectos;
	this.isRutaUnica = actividad.isRutaUnica;

	this.update = () => {
		organicas.update(); // 1º update financiacion
		actividad.update(); // 2º update actividad + tramite
		return self;
	}

	form.afterReset(() => {
		organicas.reset();
		actividad.setColectivo();
	});

    this.validate = data => {
		const valid = i18n.getValidators();
		if (!data.interesado)
        	valid.addRequired("interesado", "errPerfil");
		if (organicas.isEmpty())
			valid.addRequired("organica", "errOrganicas");
		if (dietas.isUpdateDietas() && valid.isOk())
			dietas.build();
		return valid.isOk();
    }
	window.validateP0 = () => form.validate(self.validate);

	this.init = () => {
		actividad.init();
		organicas.init().getTable().setAfterRender(self.update);

		form.setAutocomplete("#interesado", {
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			minLength: 5, //reduce matches
			source: term => pf.sendTerm("rcFindInteresado", term),
			render: item => (item.nif + " - " + item.nombre),
			select: item => { actividad.setColectivo(item.ci, item.email); return item.nif; },
			onReset: () => actividad.setColectivo()
		});

		const fnSource = term => pf.sendTerm("rcFindPersonal", term);
		form.loadAcItems(".ui-personal", fnSource);

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => form.copyToClipboard(url));
		return self.update();
	}
}

export default new Perfil();
