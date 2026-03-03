
import coll from "../../../components/CollectionHTML.js";
import Table from "../../../components/Table.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";

import buzon from "../../model/Buzon.js";
import Observer from "../../util/Observer.js";
import form from "../buzon.js";

export default class Organicas extends Table {
	static #organcias;

	init() {
		const facturas = form.getFacturas();
		const fnAnclar = data => { buzon.setAnclado(data); Observer.emit("anclar", data); }
		const fnDesanclar = data => { buzon.setReciente(data); Observer.emit("desanclar", data); }

		this.set("#anclar", data => api.init().json("/uae/buzon/anclar?org=" + data.org).then(() => fnAnclar(data)));
		this.set("#desanclar", data => api.init().json("/uae/buzon/desanclar?org=" + data.org).then(() => fnDesanclar(data)));
		this.set("#users", data => form.getUsuarios().load(data)); // load users tab

		const fnModal = data => { form.setItems("#utProv", data).showModal("dialog#ut"); }
		const fnReport = (ut, org) => api.init().text(`/uae/buzon/report?ut=${ut}&org=${org}`).then(api.open);
		this.set("#modal", data => { buzon.setData(data); api.init().json("/uae/buzon/ut?id=" + data.org).then(fnModal); });
		this.set("#report", data => fnReport(data.ut, data.org)); // call report service

		this.set("#buzon", data => {
			const fnOrganica = uts => (coll.size(uts) > 0)
										? facturas.load(uts, data.ut, data.oCod + " / " + data.oDesc).setFactuaOrganica(data)
										: form.showError("La orgánica " + data.oCod + " no tiene unidades tramitadoras asociadas.");
			api.init().json("/uae/buzon/ut?id=" + data.org).then(fnOrganica);
		});
		this.set("#buzon-otros", () => {
			const first = Organicas.#organcias[0]; // default organica
			const fnOtros = uts => facturas.load(uts, first.ut, this.getText("#otras")).setFactuaOtros();
			api.init().json("/uae/buzon/ut/all").then(fnOtros);
		});

		tabs.setAction("report", () => {
			fnReport(form.getValue("utProv"), buzon.getIdOrganica());
			form.closeModal(); // always close modal
		});
	}

	getOrganias = () => Organicas.#organcias;
	setOrganicas(data) { Organicas.#organcias = data; return this; }
	getAncladas() { return Organicas.#organcias.filter(buzon.isAnclado); }
	getRecientes() { return Organicas.#organcias.filter(buzon.isReciente); }
}
