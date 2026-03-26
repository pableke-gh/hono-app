
import FormBase from "../../components/forms/FormBase.js";
import factura from "../model/Factura.js";
import Tercero from "./inputs/tercero.js";
import fiscalidad from "../data/fiscal.js"
import form from "./factura.js";

export default class Fiscal extends FormBase {
	#tercero = this.getElement("tercero");

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.#tercero.init();
		this.addChange("subtipo", ev => this.update(+ev.target.value))
			.addChange("sujeto", ev => { factura.setSujeto(+ev.target.value); this.refresh(factura); })
			.addChange("face", ev => { factura.setFace(+ev.target.value); this.refresh(factura); });
		this.set("update-face", el => { // handler to update face inputs group
			el.innerHTML = factura.isPlataforma() ? "Nombre de la plataforma" : "Órgano Gestor";
			el.nextElementSibling.setAttribute("maxlength", factura.isPlataforma() ? 20 : 9);
		});
	}

	#fiscalidad(tercero) {
		if (factura.isCartaPago()) // no es facturable
			return fiscalidad.getCartaPago(factura.getSubtipo());
		if (factura.isTtppEmpresa())
			return fiscalidad.getTtppEmpresa(); // TTPP a empresa
		let key = "c" + tercero.imp; //caracter => persona fisica=1, persona juridica=2, est. publico=3
		key += (tercero.int & 256) ? "ep" : "no"; // Establecimiento permanente
		const ep_es = (tercero.int & 128) || (tercero.int & 256); //Establecimiento permanente o Residente
		// Residente en la peninsula=es, ceuta-melillacanarias=np, comunitario=ue, resto del mundo=zz
		key += ep_es ? ((tercero.int & 2048) ? "es" : "np") : ((tercero.int & 2) ? "ue" : "zz");
		return fiscalidad.get(key, factura.getSubtipo()); // complete key
	}
	#updateFiscalidad(tercero) {
		if (!tercero) return; // nada que modificar
		const data = this.#fiscalidad(tercero); // new data
		form.setData(data, ".ui-fiscal").setIva(data.iva); // update fields + iva
		factura.setSujeto(data.sujeto);
	}

	view = data => {
		const fact = data.solicitud; // datos del servidor
		this.#tercero.setDelegaciones(data.delegaciones); // tercero + delegaciones
		this.#updateFiscalidad(data.tercero); // actualizo la fiscalidad por defecto
		factura.setSujeto(fact.sujeto).setFace(fact.face); // sujeto / exento + face
	}
	update = subtipo => {
		factura.setSubtipo(subtipo).setNifTercero(this.#tercero.getCode());
		this.#updateFiscalidad(this.#tercero.getCurrent());
		this.refresh(factura); // force refresh view
	}
}

customElements.define("tercero-input", Tercero, { extends: "input" });
