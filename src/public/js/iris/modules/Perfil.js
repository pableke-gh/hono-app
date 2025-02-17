
import coll from "../../components/Collection.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import organica from "../model/Organica.js"
import getActividad from "../data/actividades.js"
//import tribunales from "../data/irse/tribunales.js"

export default function Perfil(form) {
	const self = this; //self instance
	let _eColectivo, _tblOrganicas;

	this.getRol = () => form.getval("#rol");
	this.getActividad = () => form.getval("#actividad");
	this.isColaboracion = () => (self.getActividad() == "OCE") || (self.getActividad() == "IAE+OCE");
	this.isTribunal = () => (self.getActividad() == "ATR") || (self.getActividad() == "IAE+ATR");
	this.isFormacion = () => (self.getActividad() == "AFO") || (self.getActividad() == "IAE+AFO");
	this.isCom = () => (self.getActividad() == "COM");
	this.isMun = () => (self.getActividad() == "MUN");
	this.isMes = () => (self.getActividad() == "MES");
	this.isIae = () => (self.getActividad() == "IAE");
	this.isAtr = () => (self.getActividad() == "ATR");
	this.isAfo = () => (self.getActividad() == "AFO");
	this.isAcs = () => (self.getActividad() == "ACS");
	this.isCtp = () => (self.getActividad() == "CTP");
	this.isOce = () => (self.getActividad() == "OCE");
	this.isA7j = () => (self.getActividad() == "A7J");
	this.isMov = () => (self.getActividad() == "MOV");
	this.is1Dia = () => (self.isMun() || self.isMes() || self.isAcs() || self.isAfo() || self.isAtr() || self.isCtp() || self.isOce())

	this.getTramite = () => form.getval("#tramite");
	this.isAut = () => (self.getTramite() == "AUT");
	this.isAutA7j = () => (self.isAut() || self.isA7j());

	this.getColectivo = () => form.getText("#colectivo");
	this.setColectivo = (colectivo, email) => {
		// Show mailto icon and update href attribute
		_eColectivo.nextElementSibling.setVisible(email).setAttribute("href", "mailto:" + email);
		_eColectivo.parentNode.setVisible(colectivo);
		_eColectivo.innerText = colectivo;
		return self.update();
	}

	//this.getTribunales = () => tribunales;
	//this.getTribunal = (name) => tribunales["at" + name] || 0;

	this.getFinanciacion = () => form.getval("#financiacion");
	this.isIsu = () => (self.getFinanciacion() == "ISU") || (self.getFinanciacion() == "xSU");
	this.isA83 = () => (self.getFinanciacion() == "A83") || (self.getFinanciacion() == "x83");
	this.isACA = () => (self.getFinanciacion() == "ACA") || (self.getFinanciacion() == "xAC");
	this.isOTR = () => (self.getFinanciacion() == "OTR") || (self.getFinanciacion() == "xOT");

	this.update = () => {
		form.setStrval("#financiacion", organica.getFinanciacion(_tblOrganicas.getData())) //recalculo la financiacion
			.select("#actividad", getActividad(self.getRol(), self.getColectivo(), self.getFinanciacion()))
			.select("#tramite", (self.isCom() || self.isMov()) ? 7 : 1) //default = AyL
			.hide(".fin-info").show(".fin-" + self.getFinanciacion())
			.setVisible("#add-org", _tblOrganicas.isEmpty()).closeAlerts().setval("#organica")
			.saveTable("#presupuesto", _tblOrganicas);
		const elMsgCd = form.querySelector(".msg-cd");
		if (elMsgCd) { // hay mensaje a mostrar?
			const org = _tblOrganicas.getFirst();
			elMsgCd.render(org).setVisible(org);
		}
		return self;
	}

	this.init = () => {
		_eColectivo = form.querySelector("#colectivo");
		_tblOrganicas = form.setTable("#organicas");
		_tblOrganicas.setMsgEmpty("No existen orgánicas asociadas a la comunicación.") // #{msg['lbl.organicas.not.found']}
					.setRender(organica.row).setFooter(organica.tfoot)
					.render(coll.parse(form.getText("#org-data")))
					.setAfterRender(self.update);

		const acOrganiaca = form.setAutocomplete("#organica", {
			minLength: 4,
			source: term => pf.sendTerm("rcFindOrg", term),
			render: item => item.o + " - " + item.dOrg,
			select: item => {
				if (!IRSE.uxxiec)
					_tblOrganicas.render([item]);
				return item.id;
			},
			onReset: () => form.hide(".msg-cd")
		});
		form.addClick("a[href='#add-org']", () => {
			const current = acOrganiaca.getCurrentItem();
			if (current && !_tblOrganicas.getData().find(org => (org.id==current.id)))
				_tblOrganicas.push(current);
		});

		const acInteresado = form.setAutocomplete("#interesado", {
			delay: 500, //milliseconds between keystroke occurs and when a search is performed
			minLength: 5, //reduce matches
			source: term => pf.sendTerm("rcFindInteresado", term),
			render: item => (item.nif + " - " + item.nombre),
			select: item => { self.setColectivo(item.ci, item.email); return item.nif; },
			onReset: () => self.setColectivo()
		});
		const fnSource = term => pf.sendTerm("rcFindPersonal", term);
		form.setAcItems("#promotor", fnSource);
		form.setAcItems("#tribunal", fnSource);
		form.setAcItems("#mesa", fnSource);

		const url = "https://campusvirtual.upct.es/uportal/pubIfPage.xhtml?module=REGISTRO_EXTERNO";
		form.setClick("a#reg-externo", () => form.copyToClipboard(url));

		_eColectivo.parentNode.setVisible(acInteresado.isLoaded());
		form.onChangeInput("#actividad", self.update);
		return self.update();
	}

    this.validate = data => {
		const valid = i18n.getValidators();
		if (!data.interesado)
        	valid.addRequired("interesado", "errPerfil");
		if (_tblOrganicas.isEmpty())
			valid.addRequired("organica", "errOrganicas");
		return valid.isOk();
    }

	form.afterReset(() => {
		_tblOrganicas.reset();
		_eColectivo.parentNode.hide();
		form.hide(".msg-cd");
		self.update();
	});
}
