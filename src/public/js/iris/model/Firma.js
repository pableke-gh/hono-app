
import i18n from "../../i18n/langs.js";

function Firma() {
	const self = this; //self instance

	this.isAceptada = firma => ((firma.mask & 32) == 32);
	this.isRechazada = firma => ((firma.mask &= ~32) && firma.info); //~32 = ...1111111011111

	this.render = data => {
		const name =(data.nombre + " " + data.ap1 + " " + data.ap2).trim();
		const aceptada = `<i class="fas fa-flag-alt text-green icon" title="Firma aceptada">Aceptada ${i18n.isoDate(data.fecha)}`;
		const rechazada = `<i class="fas fa-flag-alt text-error icon" title="#{f.info}"></i>Rechazada ${i18n.isoDate(data.fecha)}`;
		const pendiente = '<i class="fas fa-flag-alt text-warn icon" title="Pendiente de firma"></i>Pendiente';
		const firma = self.isAceptada(data) ? aceptada : (self.isRechazada(data) ? rechazada : pendiente);
		return `<div class="ui-block-box"><p>${data.cargo}</p><p>${name}</p><p>${firma}</p></div>`;
	}
}

export default new Firma();
