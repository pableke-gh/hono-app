
import api from "../../components/Api.js"

import factura from "../model/Factura.js";
import fiscalidad from "../data/fiscal.js"

import lineas from "./lineas.js";
import xeco from "../../xeco/xeco.js";

function Fiscal() {
	const self = this; //self instance
	const form = xeco.getForm();

	const delegaciones = form.setDatalist("#delegacion");
	const fnChange = item => form.setValue("#idDelegacion", item.value); 
	delegaciones.setEmptyOption("Seleccione una delegación").setChange(fnChange);

	const acTercero = form.setAutocomplete("#acTercero");
	const fnSource = term => api.init().json(`/uae/fact/terceros?term=${term}`).then(acTercero.render);
	const fnSelect = tercero => {
		api.init().json(`/uae/fact/delegaciones?ter=${tercero.value}`).then(delegaciones.setItems);
		self.update(factura.getSubtipo(), tercero);
	}
	acTercero.setDelay(500).setItemMode(5)
			.setSource(fnSource).setAfterSelect(fnSelect)
			.setReset(delegaciones.reset);

	this.setTercero = (id, label) => {
		acTercero.setValue(id, label);
		return self;
	}
	this.setSujeto = sujeto => {
		factura.setSujeto(sujeto);
		form.refresh(factura);
		return self;
	}
	this.setFace = face => {
		factura.setFace(face);
		form.refresh(factura);
		return self;
	}

	const fnFiscalidad = tercero => {
		if (!factura.isFacturable()) // no es facturab
			return fiscalidad.getCartaPago(); // default = carta de pago
        let key = "c" + tercero.imp; //caracter => persona fisica=1, persona juridica=2, est. publico=3
        key += (tercero.int & 256) ? "ep" : "no"; // Establecimiento permanente
        const ep_es = (tercero.int & 128) || (tercero.int & 256); //Establecimiento permanente o Residente
        // Residente en la peninsula=es, ceuta-melillacanarias=np, comunitario=ue, resto del mundo=zz
        key += ep_es ? ((tercero.int & 2048) ? "es" : "np") : ((tercero.int & 2) ? "ue" : "zz");
        return fiscalidad.get(key, factura.getSubtipo()); // complete key
    }
	const fnUpdateFiscalidad = tercero => {
		if (!tercero) return self; // nada que modificar
		const data = fnFiscalidad(tercero); // new data
        form.setData(data, ".ui-fiscal"); // update fields
		lineas.setIva(data.iva); // actualizo el nuevo iva
		return self.setSujeto(data.sujeto);
	}
	this.update = (subtipo, tercero) => {
		factura.setSubtipo(subtipo); // actualizo el nuevo subtipo
        form.setval("#nifTercero", acTercero.getCode()).refresh(factura);
		return fnUpdateFiscalidad(tercero || acTercero.getCurrentItem());
	}
	this.load = (tercero, del) => {
		delegaciones.setItems(del); // cargo las delegaciones
		return fnUpdateFiscalidad(tercero);
	}

	this.init = () => {
		form.onChangeInput("[name=subtipo]", ev => self.update(+ev.target.value))
			.onChangeInput("#sujeto", ev => self.setSujeto(+ev.target.value))
			.onChangeInput("#face", ev => self.setFace(+ev.target.value));
	}
}

export default new Fiscal();
