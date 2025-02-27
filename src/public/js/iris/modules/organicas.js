
import coll from "../../components/Collection.js";
import pf from "../../components/Primefaces.js";

import iris from "./iris.js";
import dietas from "./dietas.js";
import organica from "../model/Organica.js"

function Organicas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblOrganicas; // tabla de organicas

	this.getTable = () => _tblOrganicas;
	this.size = () => _tblOrganicas.size(); 
	this.isEmpty = () => _tblOrganicas.isEmpty();
	this.reset = () => _tblOrganicas.reset();
	this.getFinanciacion = () => organica.getFinanciacion(_tblOrganicas.getData());

	this.getGrupoDieta = () => form.getval("#grupo-dieta"); 
	this.getTipoDieta = () => _tblOrganicas.getFirst().tipo;
	this.isRD = () => (self.getTipoDieta() == 1);
	this.isEUT = () => (self.getTipoDieta() == 2);
	this.isUPCT = () => (self.getTipoDieta() == 9);

	this.update = () => {
		const financiacion = self.getFinanciacion(); // 1º recalculo la financiacion
		form.setStrval("#financiacion", financiacion).setVisible("#add-org", _tblOrganicas.isEmpty()).saveTable("#org-json", _tblOrganicas)
			.hide(".fin-info").show(".fin-" + financiacion);
		// actualizo la información del crédito disp.
		const elMsgCd = form.querySelector(".msg-cd");
		if (elMsgCd) { // hay mensaje a mostrar?
			const org = _tblOrganicas.getFirst();
			elMsgCd.render(org).setVisible(org);
		}
		dietas.setUpdateDietas();
		return self;
	}

	this.init = () => {
		_tblOrganicas = form.setTable("#tbl-organicas");
		_tblOrganicas.setMsgEmpty("No existen orgánicas asociadas a la comunicación.") // #{msg['lbl.organicas.not.found']}
					.setRender(organica.row).setFooter(organica.tfoot)
					.render(coll.parse(form.getText("#org-data")));

		const acOrganiaca = form.setAutocomplete("#organica", {
			minLength: 4,
			source: term => pf.sendTerm("rcFindOrg", term),
			render: item => item.o + " - " + item.dOrg,
			select: item => {
				if (!window.IRSE.uxxiec)
					_tblOrganicas.render([item]);
				return item.id;
			},
			onReset: () => form.hide(".msg-cd")
		});
		form.addClick("a[href='#add-org']", ev => {
			const current = acOrganiaca.getCurrentItem();
			if (current && !_tblOrganicas.getData().find(org => (org.id==current.id)))
				_tblOrganicas.push(current);
			acOrganiaca.reload();
			ev.preventDefault();
		});
		return self;
	}
}

export default new Organicas();
