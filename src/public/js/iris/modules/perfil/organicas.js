
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";

import iris from "../../model/Iris.js";
import organica from "../../model/Organica.js";

import actividad from "./actividad.js";
import xeco from "../../../xeco/xeco.js";

function Organicas() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblOrganicas = form.setTable("#tbl-organicas", organica.getTable());
	const acOrganiaca = form.setAutocomplete("#organica", {
		minLength: 4,
		source: term => api.init().json("/uae/iris/organicas", { term }).then(acOrganiaca.render),
		render: item => item.o + " - " + item.dOrg,
		select: item => {
			if (!iris.isUxxiec())
				_tblOrganicas.render([item]);
			return item.id;
		},
		onReset: xeco.refresh
	});

	this.size = _tblOrganicas.size; 
	this.isEmpty = _tblOrganicas.isEmpty;
	this.isChanged = _tblOrganicas.isChanged;
	this.getFinanciacion = organica.getFinanciacion;
	this.getGrupoDieta = () => form.getval("#grupo-dieta"); 
	this.getTipoDieta = organica.getTipoDieta;

	this.isChanged = _tblOrganicas.isChanged;
	this.getOrganicas = _tblOrganicas.getData;
	this.setOrganicas = organicas => { _tblOrganicas.render(organicas).setChanged(); }
	this.reset = self.setOrganicas;

	const fnAfterRender = resume => {
		organica.afterRender(resume); // 1º recalculo la financiacion
		const org = _tblOrganicas.getFirst(); // 2º actualizo la información del crédito disp.
		if (org) { // actualizo los responsables de la organica
			const responsables = " " + _tblOrganicas.getData().map(org => org.r).join(", ");
			iris.getResponsables = () => responsables; // listado de responsables de las organicas
			iris.getImpCd = () => org.imp; // importe de credito disponible de la organica
		}
		else
			iris.getImpCd = iris.getResponsables = globalThis.void;
		actividad.update(); // 3º update actividad + tramite
	}

	this.init = () => {
		_tblOrganicas.setAfterRender(fnAfterRender);
		form.set("is-add-org", _tblOrganicas.isEmpty);
	}

	tabs.setAction("addOrganica", () => {
		const organicas = _tblOrganicas.getData();
		const current = acOrganiaca.getCurrentItem();
		if (current && !organicas.find(org => (org.id == current.id)))
			_tblOrganicas.push(current);
		acOrganiaca.reload();
	});
}

export default new Organicas();
