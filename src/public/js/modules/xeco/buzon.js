
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import modals from "../../components/Modals.js";
import pf from "../../components/Primefaces.js";
import buzon from "../../model/xeco/Buzon.js";
import bf from "./buzon/facturas.js";
import usuarios from "./buzon/usuarios.js";

function fnPaginate(recientes, size) {
	recientes.getRows().forEach((row, i) => row.setVisible(i < size));
	recientes.getLastRow().show();
}
function fnLoadTables(form, ancladas, recientes, data) {
	ancladas.render(data.filter(org => (org.mask & 2)));
	form.setVisible("#card-ancladas", ancladas.size() > 0);
	recientes.render(data.filter(org => !(org.mask & 2)));
	fnPaginate(recientes, form.getval("#pagina")); // current page size
}

pf.ready(() => { // on load view
	/************** Buzon de organicas **************/
	const formOrganicas = new Form("#xeco-organicas");
	const organicas = JSON.read(formOrganicas.html("#organcias-json"));
	const tableAncladas = formOrganicas.setTable("#ancladas", {
		onRender: buzon.row,
		onFooter: buzon.tfoot
	});
	const tableRecientes = formOrganicas.setTable("#recientes", {
		rowEmptyTable: buzon.lastRow(),
		onRender: buzon.row,
		onLastRow: buzon.lastRow,
		onFooter: buzon.tfoot
	});

	const page = formOrganicas.getInput("#pagina");
	page.onchange = () => fnPaginate(tableRecientes, +page.value);
	fnLoadTables(formOrganicas, tableAncladas, tableRecientes, organicas);
	modals.set("report", () => {
		const data = buzon.getData(); // current row
		pf.fetch("report", { id: data.org, ut: formOrganicas.getval("#utProv") });
		modals.close(); // always close modal
	});

	function fnAddActions(table) {
		table.set("#anclar", data => pf.sendId("anclar", data.org));
		table.set("#desanclar", data => pf.sendId("desanclar", data.org));
		table.set("#users", data => { buzon.setData(data); pf.sendTerm("users", data.oCod); });
		table.set("#modal", data => { buzon.setData(data); pf.sendId("utProv", data.org); });
		table.set("#report", data => pf.fetch("report", { id: data.org, ut: data.ut }));

		table.set("#buzon", data => {
			const first = tableAncladas.getItem(0) || tableRecientes.getItem(0);  // default ut
			bf.init(data.oCod, data.oCod + " / " + data.oDesc, first.ut).setFactuaOrganica(data);
			bf.setChangeTipo(() => bf.setFactuaOrganica(data));
			pf.sendId("utFact", data.org);
		});
		table.set("#buzon-otros", () => {
			const first = tableAncladas.getItem(0) || tableRecientes.getItem(0); // default ut
			bf.init(null, table.html("#otras"), first.ut).setFactuaOtros();
			bf.setChangeTipo(bf.setFactuaOtros);
			window.utFact(); // id = null
		});
	}

	fnAddActions(tableAncladas);
	fnAddActions(tableRecientes);
	/************** Buzon de organicas **************/

	/************** Formulario de facturas **************/
	tabs.setShowEvent(2, bf.showTab2); // tab fichero factura
	tabs.setShowEvent(4, bf.validateJustPago).setShowEvent(5, bf.validateJustPago);
	tabs.setShowEvent(6, bf.showTab6).setViewEvent(6, bf.viewTab6); // tab resumen
	window.factUpload = (xhr, status, args) => {
		if (window.showTab(xhr, status, args, 0)) { // reload all tables
			formOrganicas.fireReset().showOk("saveOk"); // clear inputs, autofocus and message
			bf.init(); // clear file names
		}
	}
	window.loadBuzon = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args)) { // reload all tables
			fnLoadTables(formOrganicas, tableAncladas, tableRecientes, JSON.read(args.data));
			formOrganicas.showOk("saveOk"); // datos actualizados correctamente
		}
	}
	/************** Formulario de facturas **************/

	/************** Gestion de Perfiles **************/
	window.loadUsuarios = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args))
			usuarios.loadUsuarios(args);
	}
	window.updateUsuarios = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args))
			usuarios.updateUsuarios(args);
	}
	window.reloadAll = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args)) {
			args.data && fnLoadTables(formOrganicas, tableAncladas, tableRecientes, JSON.read(args.data));
			usuarios.reloadAll();
		}
	}
	/************** Gestion de Perfiles **************/
});
