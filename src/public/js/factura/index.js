
import sb from "../components/types/StringBox.js";
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "../i18n/langs.js";

import factura from "./model/Factura.js";
import lineas from "./modules/lineas.js";
import fiscal from "./modules/fiscal.js";
import xeco from "../xeco/xeco.js";

coll.ready(() => {
	// init. modules actions
	xeco.init(); fiscal.init();

	const form = xeco.getForm();
	const acOrganica = form.setAutocomplete("#acOrganica");
	// los usuarios de ttpp/gaca solo pueden ver las organicas de su unidad 300906XXXX
	const fnSourceOrg = term => api.init().json("/uae/fact/organicas", { term }).then(acOrganica.render);
	acOrganica.setItemMode(4).setSource(fnSourceOrg);

	const fnShowGestor = () => factura.isFace() || factura.isPlataforma();
	const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
	form.set("show-factura-uae", fnShowFactUae).set("show-gestor", fnShowGestor);

	factura.view = data => {
		xeco.view(data.fact, data.firmas); // load data-model before view
		acOrganica.setValue(data.fact.idOrg, data.fact.org + " - " + data.fact.descOrg);
		lineas.setLineas(data); // Load conceptos and iva input
		fiscal.load(data.tercero, data.delegaciones) // tercero + delegaciones
				.setTercero(data.fact.idTer, data.fact.nif + " - " + data.fact.tercero)
				.setSujeto(data.fact.sujeto) // update sujeto / exento
				.setFace(data.fact.face); // update face inputs group
		form.view(factura); // render form view
	}

	const fnBuild = (tipo, subtipo) => ({ fact: { tipo, subtipo, imp: 0, iva: 0 } });
	tabs.setAction("factura", () => factura.view(fnBuild(1, 14))); // create factura
	tabs.setAction("cartap", () => factura.view(fnBuild(3, 13))); // create carta de pago
	//tabs.setAction("ttpp", () => factura.view(fnBuild(6, 25))); // TTPP a empresa

	function fnValidate(msgConfirm, url, fn) {
		factura.setLineas(lineas.getTable()); // actualizo los conceptos
		const data = form.validate(factura.validate);
		if (!data || !i18n.confirm(msgConfirm))
			return Promise.reject(); // Error al validar o sin confirmacion
		const temp = Object.assign(factura.getData(), data);
		temp.lineas = lineas.getTable().getData(); // lineas de la factura
		// si no hay descripcion => concateno los conceptos saneados y separados por punto
		temp.memo = temp.memo || temp.lineas.map(linea => sb.rtrim(linea.desc, "\\.").trim()).join(". ");
		return api.setJSON(temp).json(url).then(fn); // send call
	}
	tabs.setAction("send", () => fnValidate("msgSend", "/uae/fact/save").then(tabs.showInit)); // send form
	tabs.setAction("subsanar", () => {
		const url = factura.isGaca() ? "/uae/fact/reset" : "/uae/fact/subsanar";
		fnValidate("msgSave", url).then(tabs.showList); // send from changes
	});
});
