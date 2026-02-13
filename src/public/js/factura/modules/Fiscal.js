
import api from "../../components/Api.js"
import factura from "../model/Factura.js";
import Form from "./form.js";
import fiscalidad from "../data/fiscal.js"

class Fiscal extends Form {
	#acTercero = this.setAutocomplete("#acTercero");
	#delegaciones = this.setDatalist("#delegacion");

	constructor(){
		super(); // call super before to use this reference

		const fnUpdate = (subtipo, tercero) => {
			factura.setSubtipo(subtipo).setNifTercero(this.#acTercero.getCode());
			this.#updateFiscalidad(tercero || this.#acTercero.getCurrentItem());
			this.refresh(factura); // force refresh view
		}

		const fnSource = term => api.init().json("/uae/fact/terceros", { term }).then(this.#acTercero.render);
		const fnSelect = tercero => {
			api.init().json(`/uae/fact/delegaciones?ter=${tercero.value}`).then(this.#delegaciones.setItems);
			fnUpdate(factura.getSubtipo(), tercero);
		}
		this.#acTercero.setDelay(500).setItemMode(5)
				.setSource(fnSource).setAfterSelect(fnSelect)
				.setReset(this.#delegaciones.reset);
	
		const fnChange = item => this.setValue("#idDelegacion", item.value); 
		this.#delegaciones.setEmptyOption("Seleccione una delegación").setChange(fnChange);

		this.set("update-face", el => { // handler to update face inputs group
			el.innerHTML = factura.isPlataforma() ? "Nombre de la plataforma" : "Órgano Gestor";
			el.nextElementSibling.setAttribute("maxlength", factura.isPlataforma() ? 20 : 9);
		});
		this.onChangeInput("#subtipo", ev => fnUpdate(+ev.target.value))
			.onChangeInput("#sujeto", ev => { factura.setSujeto(+ev.target.value); this.refresh(factura); })
			.onChangeInput("#face", ev => { factura.setFace(+ev.target.value); this.refresh(factura); });
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
		this.setData(data, ".ui-fiscal").setIva(data.iva); // update fields + iva
		factura.setSujeto(data.sujeto);
	}
	
	view = data => {
		const fact = data.solicitud; // datos del servidor
		this.#acTercero.setValue(fact.idTer, fact.nif + " - " + fact.tercero)
		this.#delegaciones.setItems(data.delegaciones); // cargo las delegaciones
		this.#updateFiscalidad(data.tercero); // actualizo la fiscalidad por defecto
		factura.setSujeto(fact.sujeto).setFace(fact.face); // sujeto / exento + face
	}
}

export default new Fiscal();
