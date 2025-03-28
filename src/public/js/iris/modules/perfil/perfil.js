
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";

import iris from "../iris.js";
import organicas from "./organicas.js";
import actividad from "./actividad.js";

function Perfil() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	const fnRender = (nif, nombre) => (nif + " - " + nombre);
	const _acInteresado = form.setAutocomplete("#interesado", {
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		source: term => pf.sendTerm("rcFindInteresado", term),
		render: item => fnRender(item.nif, item.nombre),
		select: item => { actividad.setColectivo(item.ci, item.email); return item.nif; },
		onReset: () => actividad.setColectivo()
	});

	this.size = organicas.size;
	this.isEmpty = () => (actividad.isEmpty() || organicas.isEmpty());
	this.getGrupoDieta = organicas.getGrupoDieta;
	this.getTipoDieta = organicas.getTipoDieta;

	this.isMun = actividad.isMun;
	this.isIsu = actividad.isIsu;
	this.is1Dia = actividad.is1Dia;
	this.isTrayectos = actividad.isTrayectos;
	this.isRutaUnica = actividad.isRutaUnica;
	//this.isFacturaUpct = actividad.isFacturaUpct;

    this.validate = data => {
		const valid = form.getValidators();
		if (!data.interesado)
        	valid.addRequired("interesado", "errPerfil");
		if (organicas.isEmpty())
			valid.addRequired("organica", "errOrganicas");
		return valid.isOk() && organicas.save();
    }

	form.afterReset(() => { _acInteresado.setValue(); actividad.setColectivo(); organicas.reset(); });
	tabs.setAction("paso0", () => { form.validate(self.validate) && form.sendTab(window.rcPaso0, 1); });
	tabs.setViewEvent(1, () => form.render(".i18n-tr-h1.active")); // render steps

	this.init = () => {
		actividad.init();
		organicas.init();

		form.loadAcItems(".ui-personal", term => pf.sendTerm("rcFindPersonal", term));
		form.set("is-isu", actividad.isIsu).set("is-maps", actividad.isTrayectos);

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => form.copyToClipboard(url));
	}

	this.view = (data, interesado, orgs) => {
		organicas.setOrganicas(orgs); // update financiacion
		_acInteresado.setValue(data.nifInt, fnRender(data.nifInt, data.interesado));
		actividad.setColectivo(data.colectivo, data.emailInt);
		self.update(interesado);
	}

	this.update = interesado => {
		interesado && form.render(".dir-interesado", interesado);
	}
}

export default new Perfil();
