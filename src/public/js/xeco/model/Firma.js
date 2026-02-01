
import i18n from "../../i18n/langs.js";

class Firma {
	#fnAceptada = mask => ((mask & 32) == 32);
	#fnRechazada = (mask, info) => ((mask & ~32) && info); //~32 = ...1111111011111

	isPrincipal = mask => (mask & 2);
	isAceptada = firma => this.#fnAceptada(firma.mask);
	isRechazada = firma => this.#fnRechazada(firma.mask, firma.info);
	isFirmable = mask => (mask & 64); //puesto a la firma?

	getNif = firma => firma.nif;
	getNombre = firma => (firma.nombre + " " + (firma.ap1 || "") + " " + (firma.ap2 || "")).trim();
	getFirmante = firma => (this.getNif(firma) + " - " + this.getNombre(firma));
	getGrupo = firma => firma.grupo;
	getInfo = firma => firma.info;

	myFlag = data => {
		// plantilla para la bandera del listado de solicitudes
		if (this.#fnAceptada(data.fmask)) // bandera verde de aceptada (fmask = mascara de firma)
			return '<i class="fas fa-flag-alt text-green icon" title="Solicitud firmada"></i>';
		if (this.#fnRechazada(data.fmask, data.info)) // bandera roja de rechazada (fmask = mascara de firma)
			return '<i class="fas fa-flag-alt text-error icon" title="Solicitud rechazada"></i>';
		return '<i class="fas fa-flag-alt text-warn icon" title="Solicitud pendiente de firma"></i>'
	}
	render = data => {
		const fecha = i18n.isoDate(data.fecha); // plantilla para el listado de firmas principales
		const aceptada = `<i class="fas fa-flag-alt text-green icon" title="Firma aceptada"></i>Aceptada ${fecha}`;
		const rechazada = `<i class="fas fa-flag-alt text-error icon" title="${data.info}"></i>Rechazada ${fecha}`;
		const pendiente = '<i class="fas fa-flag-alt text-warn icon" title="Pendiente de firma"></i>Pendiente';
		const firma = this.isAceptada(data) ? aceptada : (this.isRechazada(data) ? rechazada : pendiente);
		return `<div class="ui-block-box"><p>${data.cargo}</p><p>${this.getNombre(data)}</p><p>${firma}</p></div>`;
	}
}

export default new Firma();
