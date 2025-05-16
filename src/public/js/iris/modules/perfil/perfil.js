
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import iris from "../../model/Iris.js";
import organicas from "./organicas.js";
import actividad from "./actividad.js";
import xeco from "../../../xeco/xeco.js";

function Perfil() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component

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
	this.isMaps = actividad.isMaps;
	this.isRutaUnica = actividad.isRutaUnica;
	//this.isFacturaUpct = actividad.isFacturaUpct;

    this.validate = data => {
		const valid = form.getValidators();
		if (!data.interesado)
        	valid.addRequired("interesado", "errPerfil");
		if (organicas.isEmpty())
			valid.addRequired("organica", "errOrganicas");
		// when create or reactivate iris force to invoke rcPaso0 
		form.setChanged(form.isChanged() || !form.fire("has-firmas"));
		return valid.isOk() && organicas.save();
    }

	form.afterReset(() => { _acInteresado.setValue(); actividad.setColectivo(); organicas.reset(); });
	tabs.setAction("paso0", () => { form.validate(self.validate) && form.sendTab(window.rcPaso0, 1); });

	this.init = () => {
		actividad.init();
		organicas.init();

		form.loadAcItems(".ui-personal", term => pf.sendTerm("rcFindPersonal", term));
		form.set("is-isu", actividad.isIsu).set("is-maps", actividad.isMaps);

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => form.copyToClipboard(url));

		// render steps functions
		iris.getPaso1 = () => i18n.render(i18n.set("paso", 1).get("lblPasos"), iris);
		iris.getPaso = () => i18n.render(i18n.set("paso", i18n.get("paso") + 1).get("lblPasos"), iris);
		iris.getPasoIsu = () => i18n.render(i18n.set("paso", i18n.get("paso") + actividad.isIsu()).get("lblPasos"), iris);
	}

	this.view = (interesado, orgs) => {
		const nif = iris.getNifInteresado(); // 1º set colectivo / actividad
		_acInteresado.setValue(nif, fnRender(nif, iris.getInteresado())); 
		actividad.setColectivo(iris.getColectivo(), iris.getEmailInteresado());
		organicas.setOrganicas(orgs); // 2º update financiacion
		self.update(interesado); // 3º update interesado info
	}

	this.update = interesado => {
		iris.getDirInteresado = () => {
			const tpl = "@lblDomicilio;: @dir;, @cp;, @municipio;, @provincia; (@residencia;)"; // template for matches
			return (interesado && iris.isEditable()) ? i18n.render(tpl, interesado) : null; // reload contents or hide if no matches
		}
	}
}

export default new Perfil();
