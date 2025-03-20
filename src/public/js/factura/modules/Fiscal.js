
import pf from "../../components/Primefaces.js";
import facturas from "./facturas.js";
import lineas from "./lineas.js";
import factura from "../model/Factura.js";
import fiscalidad from "../data/fiscal.js"

function Fiscal() {
	const self = this; //self instance
	const form = facturas.getForm();

	const delegaciones = pf.datalist(form, "#delegacion", "#idDelegacion");
	delegaciones.setEmptyOption("Seleccione una delegación");

	const acTercero = form.setAutocomplete("#acTercero");
	acTercero.setDelay(500).setMinLength(5)
			.setSource(term => pf.sendTerm("rcFindTercero", term))
			.setRender(item => item.label)
			.setSelect(item => { pf.sendId("rcDelegaciones", item.value); return item.value })
			.setAfterSelect(data => self.update(factura.getSubtipo(), data))
			.setReset(delegaciones.reset);

	this.setTercero = (id, label) => { acTercero.setValue(id, label); return self; }
	this.setSujeto = sujeto => {
		factura.setSujeto(sujeto);
		form.setVisible(".grupo-exento", factura.isExento()); // update sujeto inputs group
		return self;
	}
	this.setFace = face => {
		factura.setFace(face);
		const lbl = factura.isPlataforma() ? "Nombre de la plataforma:" : "Órgano Gestor:";
		form.text("[data-refresh='show-gestor'] > .label", lbl).refresh(factura.getData());
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
        form.setval("#nifTercero", acTercero.getCode()).refresh(factura.getData());
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
		return self;
	}

    window.loadDelegaciones = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args))
			delegaciones.setItems(JSON.read(args.delegaciones));
    }
}

export default new Fiscal();
