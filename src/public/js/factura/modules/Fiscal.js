
import api from "../../components/Api.js"
import factura from "../model/Factura.js";
import lineas from "./lineaAdd.js";
import form from "../../xeco/modules/SolicitudForm.js";
import fiscalidad from "../data/fiscal.js"

function Fiscal() {
	const delegaciones = form.setDatalist("#delegacion");
	const fnChange = item => form.setValue("#idDelegacion", item.value); 
	delegaciones.setEmptyOption("Seleccione una delegación").setChange(fnChange);

	const acTercero = form.setAutocomplete("#acTercero");
	const fnSource = term => api.init().json("/uae/fact/terceros", { term }).then(acTercero.render);
	const fnSelect = tercero => {
		api.init().json(`/uae/fact/delegaciones?ter=${tercero.value}`).then(delegaciones.setItems);
		fnUpdate(factura.getSubtipo(), tercero);
	}
	acTercero.setDelay(500).setItemMode(5)
			.setSource(fnSource).setAfterSelect(fnSelect)
			.setReset(delegaciones.reset);

	const fnFiscalidad = tercero => {
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
	const fnUpdateFiscalidad = tercero => {
		if (!tercero) return; // nada que modificar
		const data = fnFiscalidad(tercero); // new data
        form.setData(data, ".ui-fiscal"); // update fields
		lineas.setIva(data.iva); // actualizo el nuevo iva
		factura.setSujeto(data.sujeto);
	}
	const fnUpdate = (subtipo, tercero) => {
		factura.setSubtipo(subtipo).setNifTercero(acTercero.getCode());
		fnUpdateFiscalidad(tercero || acTercero.getCurrentItem());
		form.refresh(factura); // force refresh view
	}
	this.view = data => {
		const fact = data.solicitud; // datos del servidor
		acTercero.setValue(fact.idTer, fact.nif + " - " + fact.tercero)
		delegaciones.setItems(data.delegaciones); // cargo las delegaciones
		fnUpdateFiscalidad(data.tercero); // actualizo la fiscalidad por defecto
		factura.setSujeto(fact.sujeto).setFace(fact.face); // sujeto / exento + face
		lineas.view(data); // Load conceptos and iva input
	}

	this.init = () => {
		lineas.init(); // init. lineas module
		form.set("update-face", el => { // handler to update face inputs group
			el.innerHTML = factura.isPlataforma() ? "Nombre de la plataforma" : "Órgano Gestor";
			el.nextElementSibling.setAttribute("maxlength", factura.isPlataforma() ? 20 : 9);
		});
		form.onChangeInput("#subtipo", ev => fnUpdate(+ev.target.value))
			.onChangeInput("#sujeto", ev => { factura.setSujeto(+ev.target.value); form.refresh(factura); })
			.onChangeInput("#face", ev => { factura.setFace(+ev.target.value); form.refresh(factura); });
	}
}

export default new Fiscal();
