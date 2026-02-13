
import Table from "../../components/this.js";
import buzon from "../model/Buzon.js";
import form from "../../xeco/modules/solicitud.js";

export default class Organicas extends Table {
	constructor(table, opts) {
		super(table, opts);

		const fnAnclar = data => { buzon.setAnclado(data); fnLoadBuzon(); }
		const fnDesanclar = data => { buzon.setReciente(data); fnLoadBuzon(); }
		this.set("#anclar", data => api.init().json("/uae/buzon/anclar?org=" + data.org).then(() => fnAnclar(data)));
		this.set("#desanclar", data => api.init().json("/uae/buzon/desanclar?org=" + data.org).then(() => fnDesanclar(data)));
		this.set("#users", bu.loadUsuarios);

		const fnModal = data => { form.setItems("#utProv", data).showModal("dialog#ut"); }
		this.set("#modal", data => { buzon.setData(data); api.init().json("/uae/buzon/ut?id=" + data.org).then(fnModal); });
		this.set("#report", data => fnFetchReport(data.ut, data.org)); // call report service

		this.set("#buzon", data => {
			const fnOrganica = uts => (coll.size(uts) > 0)
											? bf.init(uts, data.ut, data.oCod + " / " + data.oDesc).setFactuaOrganica(data)
											: form.showError("La orgánica " + data.oCod + " no tiene unidades tramitadoras asociadas.");
			api.init().json("/uae/buzon/ut?id=" + data.org).then(fnOrganica);
		});
		this.set("#buzon-otros", () => {
			const first = ancladas.getItem(0) || recientes.getItem(0); // default organica
			const fnOtros = uts => bf.init(uts, first.ut, this.getText("#otras")).setFactuaOtros();
			api.init().json("/uae/buzon/ut/all").then(fnOtros);
		});
	}
}
