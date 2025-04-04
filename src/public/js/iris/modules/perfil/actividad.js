
import iris from "../../model/Iris.js";
import xeco from "../../../xeco/xeco.js";
import actividades from "../../data/perfiles/actividades.js"

function Actividad() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	let _eColectivo; // span element

	this.isEmpty = () => (!_eColectivo.innerText);
	this.getRol = () => form.getval("#rol");
	this.isPorCuentaPropia = () => (self.getRol() == "P");
	this.isPorCuentaAjena = () => (self.getRol() == "A");

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
	this.is1Dia = () => (self.isMun() || self.isMes() || self.isAcs() || self.isAfo() || self.isAtr() || self.isCtp() || self.isOce());

	this.getFinanciacion = () => form.getval("#financiacion");
	this.isIsu = () => (self.getFinanciacion() == "ISU") || (self.getFinanciacion() == "xSU");
	this.isA83 = () => (self.getFinanciacion() == "A83") || (self.getFinanciacion() == "x83");
	this.isACA = () => (self.getFinanciacion() == "ACA") || (self.getFinanciacion() == "xAC");
	this.isOTR = () => (self.getFinanciacion() == "OTR") || (self.getFinanciacion() == "xOT");

	this.getTramite = () => form.getval("#tramite");
	this.isAut = () => (self.getTramite() == "AUT");
	this.isAutA7j = () => (self.isAut() || self.isA7j());
	this.isRutaUnica = () => (self.isAutA7j() || self.is1Dia());
	this.isLocalizaciones = () => (self.isMun() || self.isAutA7j());
	this.isMaps = () => (!self.isLocalizaciones() && !self.is1Dia());
	this.isFacturaUpct = () => true; // TODO: ver si es necesario

	this.getColectivo = () => form.getText("#colectivo");
	this.isPas = () => (self.getColectivo() == "PAS");
	this.isPdiFu = () => (self.getColectivo() == "PDI-FU");
	this.isPdiLa = () => (self.getColectivo() == "PDI-LA");
	this.isPdi = () => (self.isPdiFu() || self.isPdiLa());
	this.isAlumno = () => (self.getColectivo() == "ALU");
	this.isExterno = () => (self.getColectivo() == "EXT");
	this.setColectivo = (colectivo, email) => {
		// Show mailto icon and update href attribute
		_eColectivo.nextElementSibling.setVisible(email).setAttribute("href", "mailto:" + email);
		_eColectivo.parentNode.setVisible(colectivo);
		_eColectivo.innerText = colectivo || "";
		return self.update();
	}

	this.update = () => { // actualizo la actividad y el tramite
		form.select("#actividad", actividades(self.getRol(), self.getColectivo(), self.getFinanciacion()))
			.select("#tramite", (self.isCom() || self.isMov()) ? 7 : 1) //default = AyL
			.closeAlerts();
		iris.setPerfil(self.getRol(), self.getColectivo(), self.getActividad(), self.getTramite(), self.getFinanciacion());
		return self;
	}

	this.init = () => {
		_eColectivo = form.querySelector("#colectivo");
		form.onChangeInput("#actividad", self.update);
		form.set("is-mun", self.isMun).set("is-tribunal", self.isTribunal).set("is-mesa", globalThis.void);
	}
}

export default new Actividad();
