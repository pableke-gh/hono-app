
import sb from "../components/types/StringBox.js";
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "./i18n/langs.js";

import factura from "./model/Factura.js";
import lineas from "./modules/lineas.js";
import fiscal from "./modules/fiscal.js";
import list from "../xeco/modules/SolicitudesList.js";

coll.ready(() => { // init. fact modules
	const form = list.init(factura).getForm();
	fiscal.init();

	const acOrganica = form.setAutocomplete("#acOrganica");
	// los usuarios de ttpp/gaca solo pueden ver las organicas de su unidad 300906XXXX
	const fnSourceOrg = term => api.init().json("/uae/fact/organicas", { term }).then(acOrganica.render);
	acOrganica.setItemMode(4).setSource(fnSourceOrg);

	const fnShowGestor = () => factura.isFace() || factura.isPlataforma();
	const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
	form.set("show-factura-uae", fnShowFactUae).set("show-gestor", fnShowGestor);

	factura.onView = data => {
		const fact = data.solicitud; // datos del servidor
		acOrganica.setValue(fact.idOrg, fact.org + " - " + fact.descOrg);
		fiscal.view(data); // tercero + delegaciones +  sujeto/exento + face
	}

	const fnBuild = (tipo, subtipo) => ({ solicitud: { tipo, subtipo, imp: 0, iva: 0 } });
	tabs.setAction("factura", () => list.create(fnBuild(1, 14))); // create factura
	tabs.setAction("cartap", () => list.create(fnBuild(3, 13))); // create carta de pago
	//tabs.setAction("ttpp", () => list.create(fnBuild(6, 25))); // TTPP a empresa

	function fnValidate(msgConfirm, url) {
		const data = form.validate(lineas.validate);
		if (!data || !i18n.confirm(msgConfirm))
			return Promise.reject(); // Error al validar o sin confirmacion
		const temp = Object.assign(factura.getData(), data);
		temp.lineas = lineas.getData(); // lineas de la factura
		// si no hay descripcion => concateno los conceptos saneados y separados por punto
		temp.memo = temp.memo || temp.lineas.map(linea => sb.rtrim(linea.desc, "\\.").trim()).join(". ");
		return api.setJSON(temp).json(url); // send call
	}
	tabs.setAction("send", () => fnValidate("msgSend", "/uae/fact/save").then(tabs.showInit)); // send form
	tabs.setAction("subsanar", () => {
		const url = factura.isGaca() ? "/uae/fact/reset" : "/uae/fact/subsanar";
		fnValidate("msgSave", url).then(tabs.showList); // send from changes
	});
});
