
import pf from "../../../components/Primefaces.js";
import iris from "../iris.js";
import actividad from "./actividad.js";
import organica from "../../model/Organica.js"

function Organicas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblOrganicas; // tabla de organicas
	let _saveOrganicas; // bool indicator

	this.getForm = () => form;
	this.getActividad = () => actividad;
	this.size = () => _tblOrganicas.size(); 
	this.isEmpty = () => _tblOrganicas.isEmpty();
	this.reset = () => self.setOrganicas();
	this.getFinanciacion = () => organica.getFinanciacion(_tblOrganicas.getData());

	this.getGrupoDieta = () => form.getval("#grupo-dieta"); 
	this.getTipoDieta = () => _tblOrganicas.getFirst().tipo;
	this.isRD = () => (self.getTipoDieta() == 1);
	this.isEUT = () => (self.getTipoDieta() == 2);
	this.isUPCT = () => (self.getTipoDieta() == 9);

	const fnUpdateTab = () => {
		// 1º recalculo la financiacion
		const financiacion = self.getFinanciacion();
		form.setStrval("#financiacion", financiacion)
			.setVisible("#add-org", _tblOrganicas.isEmpty())
			.hide(".fin-info").show(".fin-" + financiacion);
		const org = _tblOrganicas.getFirst();
		// 2º actualizo la información del crédito disp.
		const elMsgCd = form.querySelector(".msg-cd");
		if (elMsgCd) // hay mensaje a mostrar?
			elMsgCd.render(org).setVisible(org);
		if (org) { // actualizo los responsables
			const responsables = _tblOrganicas.getData().map(org => org.r).join(", ");
			form.text("span#responsables", " " + responsables);
		}
		else
			form.text("span#responsables", "");
		actividad.update(); // 3º update actividad + tramite
		_saveOrganicas = true;
		return self;
	}
	this.setOrganicas = organicas => {
		_tblOrganicas.render(organicas);
		_saveOrganicas = false;
		return self;
	}
	this.save = () => {
		if (!_saveOrganicas)
			return self; // no hay cambios
		form.saveTable("#org-json", _tblOrganicas);
		_saveOrganicas = false;
		return self
	}

	this.init = () => {
		_tblOrganicas = form.setTable("#tbl-organicas");
		_tblOrganicas.setMsgEmpty("No existen orgánicas asociadas a la comunicación.") // #{msg['lbl.organicas.not.found']}
					.setRender(organica.row).setFooter(organica.tfoot).setAfterRender(fnUpdateTab);

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
			const organicas = _tblOrganicas.getData();
			const current = acOrganiaca.getCurrentItem();
			if (current && !organicas.find(org => (org.id == current.id)))
				_tblOrganicas.push(current);
			acOrganiaca.reload();
			ev.preventDefault();
		});
		return self
	}
}

export default new Organicas();
