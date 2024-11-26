
import coll from "../../../components/CollectionHTML.js";
import i18n from "../../../i18n/langs.js";

import nb from "../../../lib/uae/number-box.js";
import dom from "../../../lib/uae/dom-box.js";

import perfil from "./perfil.js";
import rutas from "./rutas.js";
import dietas from "./dietas.js";
import imputacion from "./imputacion.js";

function IrseOrganicas() {
	const self = this; //self instance

	const resume = {
		imp1: 0,
		totManutenciones: 0, totPernoctas: 0,
		totTransporte: 0, totAc: 0
	};
	const STYLES = {
		remove: "removeOrg",
		imp1: i18n.isoFloat,
		subtipo: val => i18n.getItem("tiposMultiorganica", val)
	};
	let organicas;

	this.getImpTransporte = function() { return resume.totTransporte; }
	this.getImpPernoctas = function() { return resume.totPernoctas; }
	this.getImpDietas = function() { return resume.totManutenciones; }
	this.getImpAc = function() { return resume.totAc; }

	this.getTotTransporte = function() { return rutas.getImpKm() + IRSE.impTransporte + IRSE.impExtraTrans; }
	this.getTotPernoctas = function() { return IRSE.minPernoctas + IRSE.impExtraAloja; }
	this.getTotDietas = function() { return dietas.getImpPercibir() + IRSE.impExtraDietas; }
	this.getImpBruto = () => (self.getTotTransporte() + self.getTotPernoctas() + self.getTotDietas() + IRSE.totAc);
	this.getImpTotal = () => self.getImpBruto() - IRSE.irpf;
	this.getTotalFmt = () => i18n.isoFloat(self.getImpTotal()) + " €";

	this.validAll = function() {
		if (!nb.eq01(resume.totManutenciones, self.getTotDietas()))
			return dom.addError("#imp1-org", "errMaxDietas").isOk();
		if (!nb.eq01(resume.totPernoctas, self.getTotPernoctas()))
			return dom.addError("#imp1-org", "errMaxAloja").isOk();
		if (!nb.eq01(resume.totTransporte, self.getTotTransporte()))
			return dom.addError("#imp1-org", "errMaxTrans").isOk();
		if (!nb.eq01(resume.totAc, IRSE.totAc))
			return dom.addError("#imp1-org", "errMaxAsist").isOk();
		if (!nb.eq01(resume.imp1, self.getImpBruto()))
			return dom.addError("#imp1-org", "errImpBruto").isOk();
		return true;
	}
	this.add = function() {
		dom.closeAlerts()
			.intval("#tipo-org", "errTipo", "errRequired")
			.fk("#organicas", "errOrganicas", "errRequired")
			.gt0("#imp1-org", "errGt0", "errRequired");
		if (dom.isOk()) {
			const gasto = dom.getData();
			//validacion de importes
			if ((gasto.subtipo == "1") && ((gasto.imp1 + resume.totManutenciones) > self.getTotDietas()))
				return dom.addError("#imp1-org", "errMaxDietas").isOk();
			if ((gasto.subtipo == "2") && ((gasto.imp1 + resume.totPernoctas) > self.getTotPernoctas()))
				return dom.addError("#imp1-org", "errMaxAloja").isOk();
			if ((gasto.subtipo == "3") && ((gasto.imp1 + resume.totTransporte) > self.getTotTransporte()))
				return dom.addError("#imp1-org", "errMaxTrans").isOk();
			if ((gasto.subtipo == "4") && ((gasto.imp1 + resume.totAc) > IRSE.totAc))
				return dom.addError("#imp1-org", "errMaxAsist").isOk();
			if ((gasto.imp1 + resume.imp1) > IRSE.bruto)
				return dom.addError("#imp1-org", "errImpBruto").isOk();

			//completo los datos e inserto el gasto
			gasto.cod = dom.getOptText("#organicas");
			let org = perfil.getOrganica(+gasto.num);
			gasto.nombre = imputacion.get(gasto.subtipo, org);
			gasto.desc = org && org.dOrg;
			organicas.push(gasto);
			dom.table("#multiorganicas", organicas, resume, STYLES);
		}
		return false;
	}
	this.build = function() {
		if (perfil.empty())
			return dom.addError("#imp1-org", "errImputacion").isOk();
		if (perfil.isMultiorganica())
			return self.validAll();

		//auto-build monoorganica
		coll.reset(organicas);
		const org = perfil.getOrganicas()[0];
		const DATA = { num: org.id, cod: org.o, desc: org.dOrg };
		let aux = self.getTotDietas();
		if (aux > 0) {
			const gasto = Object.assign({ subtipo: 1 }, DATA);
			gasto.nombre = imputacion.get(gasto.subtipo, org);
			gasto.imp1 = aux;
			organicas.push(gasto);
		}
		aux = self.getTotPernoctas();
		if (aux > 0) {
			const gasto = Object.assign({ subtipo: 2 }, DATA);
			gasto.nombre = imputacion.get(gasto.subtipo, org);
			gasto.imp1 = aux;
			organicas.push(gasto);
		}
		aux = self.getTotTransporte();
		if (aux > 0) {
			const gasto = Object.assign({ subtipo: 3 }, DATA);
			gasto.nombre = imputacion.get(gasto.subtipo, org);
			gasto.imp1 = aux;
			organicas.push(gasto);
		}
		if (IRSE.totAc > 0) {
			const gasto = Object.assign({ subtipo: 4 }, DATA);
			gasto.nombre = imputacion.get(gasto.subtipo, org);
			gasto.imp1 = IRSE.totAc;
			organicas.push(gasto);
		}
		dom.table("#multiorganicas", organicas, resume, STYLES);
		return self.validAll();
	}

	this.init = form => {
		dietas.init(); // init dietas
		const divGastos = form.querySelector("#gastos-org");
		organicas = coll.parse(divGastos.innerText) || [];
		dom.onRenderTable("#multiorganicas", table => {
			resume.imp1 = 0;
			resume.totManutenciones = resume.totPernoctas = 0;
			resume.totTransporte = resume.totAc = 0;
			organicas.forEach(gasto => {
				resume.imp1 += gasto.imp1;
				resume.totManutenciones += (gasto.subtipo == "1") ? gasto.imp1 : 0;
				resume.totPernoctas += (gasto.subtipo == "2") ? gasto.imp1 : 0;
				resume.totTransporte += (gasto.subtipo == "3") ? gasto.imp1 : 0;
				resume.totAc += (gasto.subtipo == "4") ? gasto.imp1 : 0;
			});

			divGastos.innerText = JSON.stringify(organicas);
			dom.setValue("#imp-org", divGastos.innerText)
				.setValue("#imp1-org", "").setFocus("#tipo-org");
		});
		return self;
	}
}

export default new IrseOrganicas();
