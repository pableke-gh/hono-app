
import pf from "../../../components/Primefaces.js";
import factura from "../../../model/xeco/Factura.js";
import fiscalidad from "../../../data/fiscal.js"
import Lineas from "./Lineas.js";

export default function Fiscal(form) {
	const self = this; //self instance
	const lineas = new Lineas(form);

	const delegaciones = pf.datalist(form, "#delegacion", "#idDelegacion", { emptyOption: "Seleccione una delegación" });
	const acTercero = form.setAutocomplete("#acTercero", {
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		source: term => pf.sendTerm("rcFindTercero", term),
		render: item => item.label,
		select: item => { pf.sendId("rcDelegaciones", item.value); return item.value },
		afterSelect: data => self.update(factura.getSubtipo(), data),
		onReset: delegaciones.reset
	});

	this.getLineas = () => lineas;
	this.setTercero = (id, label) => { acTercero.setValue(id, label); return self; }
	this.setDelegationes = data => { delegaciones.setItems(data); return self; }
	this.setSujeto = sujeto => {
		factura.setSujeto(sujeto);
		form.setVisible(".grupo-exento", factura.isExento()); // update sujeto inputs group
		return self;
	}

	const fnUpdateFiscalidad = tercero => {
		if (!tercero) return self; // nada que modificar
		const data = self.getFiscalidad(tercero); // new data
        form.setData(data, ".ui-fiscal"); // update fields
		lineas.setIva(data.iva); // actualizo el nuevo iva
		return self.setSujeto(data.sujeto);
	}
	this.update = (subtipo, tercero) => {
		factura.setSubtipo(subtipo); // actualizo el nuevo subtipo
        form.setval("#nifTercero", acTercero.getCode()).setVisible(".show-recibo", factura.isRecibo());
		return fnUpdateFiscalidad(tercero || acTercero.getCurrentItem());
	}
	this.load = (tercero, del) => {
		delegaciones.setItems(del); // cargo las delegaciones
		return fnUpdateFiscalidad(tercero);
	}

	this.getKeyFactura = (tercero, subtipo) => {
        let key = "c" + tercero.imp; //caracter => persona fisica=1, persona juridica=2, est. publico=3
        key += (tercero.int & 256) ? "ep" : "no"; // Establecimiento permanente
        const ep_es = (tercero.int & 128) || (tercero.int & 256); //Establecimiento permanente o Residente
        // Residente en la peninsula=es, ceuta-melillacanarias=np, comunitario=ue, resto del mundo=zz
        key += ep_es ? ((tercero.int & 2048) ? "es" : "np") : ((tercero.int & 2) ? "ue" : "zz");
        return key + subtipo; // complete key
    }

    this.getKeyCp = subtipo => ("cp" + subtipo);
    this.getFiscalidad = tercero => {
        const subtipo = factura.getSubtipo(); // subtipo = tipo de ingreso de la factura
		const key = factura.isFacturable() ? self.getKeyFactura(tercero, subtipo) : self.getKeyCp(subtipo);
		return fiscalidad[key] || fiscalidad.default;
    }
}
