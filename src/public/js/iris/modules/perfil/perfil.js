
import pf from "../../../components/Primefaces.js";
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
		form.set("titulo", self.getPerfil()).set("codigo", window.IRSE.codigo).render(".titulo-perfil"); // render titles
		return self; // update view
	}
	this.update = organicas => {
		organicas && this.setOrganicas(organicas);
		return self; // update view
	}
	this.refresh = () => {
		form.refresh().render(".i18n-tr-h1.active"); // render steps
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

		form.loadAcItems(".ui-personal", term => pf.sendTerm("rcFindPersonal", term));
		form.set("is-isu", actividad.isIsu).set("is-maps", actividad.isTrayectos);

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => form.copyToClipboard(url));
		return self;
	}
}

export default new Perfil();
