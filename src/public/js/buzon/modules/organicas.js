
import Form from "../../components/forms/Form.js";
import pf from "../../components/Primefaces.js";
import bf from "./facturas.js";
import buzon from "../model/Buzon.js";
import organica from "../model/Organica.js";

function Organicas() {
	const self = this; //self instance
	const form = new Form("#xeco-organicas");
	const tAncladas = form.setTable("#ancladas", organica.getTableAncladas());
	const tRecientes = form.setTable("#recientes", organica.getTableRecientes());

	function fnPaginate(size) {
		tRecientes.getRows().forEach((row, i) => row.setVisible(i < size));
		tRecientes.getLastRow().show();
		return self;
	}
	function fnLoadTables(data) {
		tAncladas.render(data.filter(org => (org.mask & 2)));
		form.setVisible("#card-ancladas", tAncladas.size() > 0);
		tRecientes.render(data.filter(org => !(org.mask & 2)));
		return fnPaginate(form.getval("#pagina")); // current page size
	}
	function fnAddActions(table) {
		table.set("#anclar", data => pf.sendId("anclar", data.org));
		table.set("#desanclar", data => pf.sendId("desanclar", data.org));
		table.set("#usersByOrganica", data => { buzon.setData(data); pf.sendTerm("rcUsersByOrganica", data.oCod); });
		table.set("#modal", data => { buzon.setData(data); pf.sendId("utProv", data.org); });
		table.set("#report", data => pf.fetch("report", { id: data.org, ut: data.ut }));

		table.set("#buzon", data => {
			const first = tAncladas.getItem(0) || tRecientes.getItem(0);  // default ut
			bf.init(data.oCod, data.oCod + " / " + data.oDesc, first.ut).setFactuaOrganica(data);
			pf.sendId("utFact", data.org);
		});
		table.set("#buzon-otros", () => {
			const first = tAncladas.getItem(0) || tRecientes.getItem(0); // default ut
			bf.init(null, table.getText("#otras"), first.ut).setFactuaOtros();
			window.utFact(); // id = null
		});
	}

	this.getForm = () => form;
	this.getAncladas = () => tAncladas;
	this.getRecientes = () => tRecientes;

	this.init = () => {
		fnAddActions(tAncladas);
		fnAddActions(tRecientes);
		form.onChangeInput("#pagina", ev => fnPaginate(+ev.target.value));
		return fnLoadTables(JSON.read(form.getHtml("#organicas-json")));
	}

	// Global functions
	window.loadBuzon = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args)) { // response ok
			fnLoadTables(JSON.read(args.data)); // reload all tables
			form.showOk("saveOk"); // datos actualizados correctamente
		}
	}
}

export default new Organicas();
