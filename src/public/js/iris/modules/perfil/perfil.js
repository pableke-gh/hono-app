
import pf from "../../../components/Primefaces.js";
import i18n from "../../../i18n/langs.js";

import organicas from "./organicas.js";
import perfiles from "../../data/perfiles/perfiles.js"; 

function Perfil() {
	const self = this; //self instance
	const form = organicas.getForm(); // form component
	const actividad = organicas.getActividad();

	this.size = organicas.size;
	this.isEmpty = () => (actividad.isEmpty() || organicas.isEmpty());
	this.getGrupoDieta = organicas.getGrupoDieta;
	this.getTipoDieta = organicas.getTipoDieta;

	this.isMun = actividad.isMun;
	this.isIsu = actividad.isIsu;
	this.is1Dia = actividad.is1Dia;
	this.isTrayectos = actividad.isTrayectos;
	this.isRutaUnica = actividad.isRutaUnica;
	this.isFacturaUpct = actividad.isFacturaUpct;

	this.getPerfil = () => {
		return perfiles(actividad.getRol(), actividad.getColectivo(), actividad.getActividad(), actividad.getTramite(), actividad.getFinanciacion());
	}
	this.setOrganicas = data => {
		organicas.setOrganicas(data); // update financiacion
		// actualizo la vista del perfil para el formulario
		const pasos = form.querySelectorAll(".i18n-tr-h1");
		//pasos[0].classList.add("active");
		pasos[1].classList.toggle("active", self.isTrayectos()); 
		pasos[2].classList.toggle("active", self.isIsu()); 
		//pasos[3].classList.add("active");

		i18n.set("titulo", self.getPerfil()).set("codigo", window.IRSE.codigo);
		form.render(".i18n-tr-h1.active").render(".titulo-perfil"); // render texts
		return self; // update view
	}

	form.afterReset(() => {
		organicas.reset();
		actividad.setColectivo();
	});

    this.validate = data => {
		const valid = form.getValidators();
		if (!data.interesado)
        	valid.addRequired("interesado", "errPerfil");
		if (organicas.isEmpty())
			valid.addRequired("organica", "errOrganicas");
		return valid.isOk() && organicas.save();
    }
	window.validateP0 = () => form.validate(self.validate);

	this.init = () => {
		actividad.init();
		organicas.init();

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
		return self;
	}
}

export default new Perfil();
