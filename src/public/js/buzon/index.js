
import coll from "../components/CollectionHTML.js";
import dom from "../components/forms/DomBox.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";

import buzon from "./model/Buzon.js";
import organica from "./model/Organica.js";

import bu from "./modules/usuarios.js";
import bf from "./modules/facturas.js";
import xeco from "../xeco/xeco.js";

coll.ready(() => { // on load view
	const form = xeco.getForm();
	const tAncladas = form.setTable("#ancladas", organica.getTableAncladas());
	const tRecientes = form.setTable("#recientes", organica.getTableRecientes());

	function fnPaginate(size) {
		tRecientes.getRows().forEach((row, i) => row.setVisible(i < size));
		tRecientes.getLastRow().show();
	}
	function fnLoadTables(data) {
		tAncladas.render(data.filter(buzon.isAnclado));
		form.setVisible("#card-ancladas", tAncladas.size() > 0);
		tRecientes.render(data.filter(buzon.isReciente));
		fnPaginate(form.getval("#pagina")); // current page size
	}
	const fnFetchReport = (ut, org) => api.init().text(`/uae/buzon/report?ut=${ut}&org=${org}`).then(api.open);
	const fnLoadBuzon = () => {
		fnLoadTables(tAncladas.getData().concat(tRecientes.getData())); // reload all tables
		form.showOk("saveOk"); // datos actualizados correctamente
	}
	function fnAddActions(table) {
		const fnAnclar = data => { buzon.setAnclado(data); fnLoadBuzon(); }
		const fnDesanclar = data => { buzon.setReciente(data); fnLoadBuzon(); }
		table.set("#anclar", data => api.init().json("/uae/buzon/anclar?org=" + data.org).then(form.resolve).then(() => fnAnclar(data)));
		table.set("#desanclar", data => api.init().json("/uae/buzon/desanclar?org=" + data.org).then(form.resolve).then(() => fnDesanclar(data)));
		table.set("#users", bu.loadUsuarios);

		const fnModal = data => { form.setItems("#utProv", data).showModal("dialog#ut"); }
		table.set("#modal", data => { buzon.setData(data); api.init().json("/uae/buzon/ut?id=" + data.org).then(fnModal); });
		table.set("#report", data => fnFetchReport(data.ut, data.org)); // call report service

		table.set("#buzon", data => {
			const fnOrganica = uts => bf.init(uts, data.ut, data.oCod + " / " + data.oDesc).setFactuaOrganica(data)
			api.init().json("/uae/buzon/ut?id=" + data.org).then(fnOrganica);
		});
		table.set("#buzon-otros", () => {
			const first = tAncladas.getItem(0) || tRecientes.getItem(0); // default organica
			const fnOtros = uts => bf.init(uts, first.ut, table.getText("#otras")).setFactuaOtros();
			api.init().json("/uae/buzon/ut/all").then(fnOtros);
		});
	}

	fnAddActions(tAncladas);
	fnAddActions(tRecientes);
	form.onChangeInput("#pagina", ev => fnPaginate(+ev.target.value));
	fnLoadTables(JSON.read(form.getHtml("#organicas-json")));

	/*tabs.setViewEvent(0, () => { // TODO: reload si son permisos propios
		buzon.isChanged() ? fnLoadBuzon() : buzon.setChanged();
	});*/
	tabs.setAction("report", () => {
		fnFetchReport(form.getval("#utProv"), buzon.getIdOrganica());
		form.closeModal(); // always close modal
	});

	// update colspan on small screens
	const fnResize = () => dom.setAttr(tRecientes.getLastRow().cells[0], "colspan", dom.isMediaXs() ? 3 : 4);
	window.addEventListener("resize", fnResize);
	fnResize(); // init colspan on load
});
