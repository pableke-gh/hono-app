
import i18n from "../../i18n/langs.js";

function Firma() {
	const self = this; //self instance

    this.isPrincipal = mask => (mask & 2);
	this.isAceptada = firma => ((firma.mask & 32) == 32);
	this.isRechazada = firma => ((firma.mask &= ~32) && firma.info); //~32 = ...1111111011111
	this.isFirmable = mask => (mask & 64); //puesto a la firma?

	this.myFlag = firma => {
		if (self.isAceptada(firma))
			return '<i class="fas fa-flag-alt text-green icon" title="Solicitud firmada"></i>';
		if (self.isRechazada(firma))
			return '<i class="fas fa-flag-alt text-error icon" title="Solicitud rechazada"></i>';
		return '<i class="fas fa-flag-alt text-warn icon" title="Solicitud pendiente de firma"></i>'
	}
	this.render = data => {
		const name = (data.nombre + " " + (data.ap1 || "") + " " + (data.ap2 || "")).trim();
		const aceptada = `<i class="fas fa-flag-alt text-green icon" title="Firma aceptada"></i>Aceptada ${i18n.isoDate(data.fecha)}`;
		const rechazada = `<i class="fas fa-flag-alt text-error icon" title="${data.info}"></i>Rechazada ${i18n.isoDate(data.fecha)}`;
		const pendiente = '<i class="fas fa-flag-alt text-warn icon" title="Pendiente de firma"></i>Pendiente';
		const firma = self.isAceptada(data) ? aceptada : (self.isRechazada(data) ? rechazada : pendiente);
		return `<div class="ui-block-box"><p>${data.cargo}</p><p>${name}</p><p>${firma}</p></div>`;
	}

	this.validate = data => {
		const valid = i18n.getValidators();
		const msg = "Debe indicar un motivo para el rechazo de la solicitud.";
		return valid.size("rechazo", data.rechazo, msg).isOk(); // Required string
	}
}

export default new Firma();
