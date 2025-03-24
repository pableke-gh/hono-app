
import i18n from "../../i18n/langs.js";

function Firma() {
	const self = this; //self instance

	const fnAceptada = mask => ((mask & 32) == 32);
	const fnRechazada = (mask, info) => ((mask & ~32) && info); //~32 = ...1111111011111

    this.isPrincipal = mask => (mask & 2);
	this.isAceptada = firma => fnAceptada(firma.mask);
	this.isRechazada = firma => fnRechazada(firma.mask, firma.info);
	this.isFirmable = mask => (mask & 64); //puesto a la firma?

	this.getNombre = firma => (firma.nombre + " " + (firma.ap1 || "") + " " + (firma.ap2 || "")).trim();
	this.getInfo = firma => firma.info;

	this.myFlag = data => {
		// plantilla para la bandera del listado de solicitudes
		if (fnAceptada(data.fmask)) // bandera verde de aceptada (fmask = mascara de firma)
			return '<i class="fas fa-flag-alt text-green icon" title="Solicitud firmada"></i>';
		if (fnRechazada(data.fmask, data.info)) // bandera roja de rechazada (fmask = mascara de firma)
			return '<i class="fas fa-flag-alt text-error icon" title="Solicitud rechazada"></i>';
		return '<i class="fas fa-flag-alt text-warn icon" title="Solicitud pendiente de firma"></i>'
	}
	this.render = data => {
		const fecha = i18n.isoDate(data.fecha); // plantilla para el listado de firmas principales
		const aceptada = `<i class="fas fa-flag-alt text-green icon" title="Firma aceptada"></i>Aceptada ${fecha}`;
		const rechazada = `<i class="fas fa-flag-alt text-error icon" title="${data.info}"></i>Rechazada ${fecha}`;
		const pendiente = '<i class="fas fa-flag-alt text-warn icon" title="Pendiente de firma"></i>Pendiente';
		const firma = self.isAceptada(data) ? aceptada : (self.isRechazada(data) ? rechazada : pendiente);
		return `<div class="ui-block-box"><p>${data.cargo}</p><p>${self.getNombre(data)}</p><p>${firma}</p></div>`;
	}

	this.validate = data => {
		const valid = i18n.getValidators();
		const msg = "Debe indicar un motivo para el rechazo de la solicitud.";
		return valid.size("rechazo", data.rechazo, msg).isOk(); // Required string
	}
}

export default new Firma();
