
import Table from "../../../components/Table.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";

import iris from "../../model/Iris.js";
import organica from "../../model/Organica.js";

import actividad from "./actividad.js";
import form from "../iris.js";

class Organicas extends Table {
	constructor() {
		super(form.querySelector("#tbl-organicas"), organica.getTable());
		this.setAfterRender(resume => {
			organica.afterRender(resume); // 1º recalculo la financiacion
			const org = this.getFirst(); // 2º actualizo la información del crédito disp.
			if (org) { // actualizo los responsables de la organica
				const responsables = " " + this.getData().map(org => org.r).join(", ");
				iris.getResponsables = () => responsables; // listado de responsables de las organicas
				iris.getImpCd = () => org.imp; // importe de credito disponible de la organica
			}
			else
				iris.getImpCd = iris.getResponsables = globalThis.void;
			actividad.update(); // 3º update actividad + tramite
		});
	}

	getOrganicas = this.getData;
	setOrganicas = data => this.render(data).setChanged(); // no data chenged
	getFinanciacion = organica.getFinanciacion;
	getGrupoDieta = () => form.getval("#grupo-dieta"); 
	getTipoDieta = organica.getTipoDieta;

	init = () => {
		const acOrganiaca = form.setAutocomplete("#organica", {
			minLength: 4,
			source: term => api.init().json("/uae/iris/organicas", { term }).then(acOrganiaca.render),
			render: item => item.o + " - " + item.dOrg,
			select: item => {
				if (!iris.isUxxiec())
					this.render([item]);
				return item.id;
			},
			onReset: form.refresh
		});

		form.set("is-add-org", this.isEmpty);
		tabs.setAction("addOrganica", () => {
			const current = acOrganiaca.getCurrentItem();
			if (current && !this.getData().find(org => (org.id == current.id)))
				this.push(current);
			acOrganiaca.reload();
		});
	}
}

export default new Organicas();
