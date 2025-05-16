
import pf from "../../../components/Primefaces.js";

import iris from "../../model/Iris.js";
import organica from "../../model/Organica.js"

import actividad from "./actividad.js";
import xeco from "../../../xeco/xeco.js";

function Organicas() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _tblOrganicas = form.setTable("#tbl-organicas", organica.getTable());

	this.size = _tblOrganicas.size; 
	this.isEmpty = _tblOrganicas.isEmpty;
	this.reset = self.setOrganicas;
	this.getFinanciacion = organica.getFinanciacion;
	this.getGrupoDieta = () => form.getval("#grupo-dieta"); 
	this.getTipoDieta = organica.getTipoDieta;

	const fnAfterRender = resume => {
		// 1º recalculo la financiacion
		organica.afterRender(resume); // actualiza la financiacion
		form.setStrval("#financiacion", self.getFinanciacion());
		// 2º actualizo la información del crédito disp.
		const org = _tblOrganicas.getFirst();
		if (org) { // actualizo los responsables de la organica
			const responsables = " " + _tblOrganicas.getData().map(org => org.r).join(", ");
			iris.getResponsables = () => responsables; // listado de responsables de las organicas
			iris.getImpCd = () => org.imp; // importe de credito disponible de la organica
		}
		else
			iris.getImpCd = iris.getResponsables = globalThis.void;
		actividad.update(); // 3º update actividad + tramite
		if (_tblOrganicas.isChanged()) // render manual del usuario
			xeco.refresh(); // 4º actualizo el perfil de la solicitud
	}
	this.setOrganicas = organicas => {
		_tblOrganicas.render(organicas).setChanged();
	}

	this.save = () => {
		if (_tblOrganicas.isChanged())
			form.saveTable("#org-json", _tblOrganicas);
		_tblOrganicas.setChanged(); // changed saved
		return self
	}

	this.init = () => {
		_tblOrganicas.setAfterRender(fnAfterRender);
		const acOrganiaca = form.setAutocomplete("#organica", {
			minLength: 4,
			source: term => pf.sendTerm("rcFindOrg", term),
			render: item => item.o + " - " + item.dOrg,
			select: item => {
				if (!iris.isUxxiec())
					_tblOrganicas.render([item]);
				return item.id;
			},
			onReset: xeco.refresh
		});

		form.set("is-add-org", _tblOrganicas.isEmpty);
		form.set("is-fin-xsu", actividad.isXsu).set("is-fin-isu", actividad.isFinIsu)
			.set("is-fin-x83", actividad.isX83).set("is-fin-a83", actividad.isFinA83);
		form.addClick("a[href='#add-org']", ev => {
			const organicas = _tblOrganicas.getData();
			const current = acOrganiaca.getCurrentItem();
			if (current && !organicas.find(org => (org.id == current.id)))
				_tblOrganicas.push(current);
			acOrganiaca.reload();
			ev.preventDefault();
		});
	}
}

export default new Organicas();
