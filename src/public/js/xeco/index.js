
import coll from "../components/CollectionHTML.js";
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";

coll.ready(() => {
    const form = new Form("#xeco");

	const acJGs = form.setAutocomplete("#jg");
	const fnSourceJg = term => api.init().json("/uae/cargos/internos", { ej: form.getval("#ej-pago"), term }).then(acJGs.render); //source
	acJGs.setItemMode().setSource(fnSourceJg);

	const acTercero = form.setAutocomplete("#tercero");
	const fnTercero = term => api.init().json("/uae/terceros", { term }).then(acTercero.render); //source
	acTercero.setDelay(500).setItemMode(5).setSource(fnTercero);

	tabs.setAction("cargo-interno", () => {
		const { idJg, jg } = form.getData(".ui-jg");
		api.init().json("/uae/cargo/interno", { id: idJg, label: jg }).then(form.showAlerts);
	});
	tabs.setAction("incompatibilidad", () => {
		const { nifTercero, tercero} = form.getData(".ui-tercero");
		api.init().json("/uae/incompatibilidad", { nif: nifTercero, label: tercero }).then(form.showAlerts);
	});
});
