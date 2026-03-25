
import sb from "../components/types/StringBox.js";
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js"
import i18n from "./i18n/langs.js";
import valid from "./i18n/validators.js";

import factura from "./model/Factura.js";
import form from "./modules/factura.js";

coll.ready(() => { // init. fact modules
	const fnShowGestor = () => factura.isFace() || factura.isPlataforma();
	const fnShowFactUae = () => factura.isUae() && factura.isFacturable();
	form.init().set("show-factura-uae", fnShowFactUae).set("show-gestor", fnShowGestor);

	const fnBuild = (tipo, subtipo) => ({ solicitud: { tipo, subtipo, imp: 0, iva: 0 } });
	tabs.setAction("factura", () => form.create(fnBuild(1, 14))); // create factura
	tabs.setAction("cartap", () => form.create(fnBuild(3, 13))); // create carta de pago
	//tabs.setAction("ttpp", () => form.create(fnBuild(6, 25))); // TTPP a empresa

	form.onSubmit(ev => {
		ev.preventDefault(); // no submitter
		const data = valid.all(); // validate form
		if (!data || !i18n.confirm(ev.submitter.dataset.confirm))
			return; // Error al validar o sin confirmacion

		const temp = Object.assign(factura.getData(), data);
		temp.lineas = form.getLineas().getData(); // lineas de la factura
		// si no hay descripcion => concateno los conceptos saneados y separados por punto
		temp.memo = temp.memo || temp.lineas.map(linea => sb.rtrim(linea.desc, "\\.").trim()).join(". ");
		const fnThen = (ev.submitter.name == "save") ? tabs.showInit : tabs.showList;
		const url = "/uae/fact/" + ev.submitter.name; // button type
		api.setJSON(temp).json(url).then(fnThen); // send data
	});
});
