

import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js"; 
import otri from "../model/Otri.js";

function Otri() {
	const self = this; //self instance
	const form = new Form("#xeco-otri"); // filter form element

	const msgEmptyTable = "No se ha encontrado información para a la búsqueda seleccionada";
	const opts = { msgEmptyTable, onRender: otri.row, onFooter: otri.tfoot };
	const tblGcr = form.setTable("#tbl-gcr", opts);

	this.getForm = () => form;
	this.getTable = () => tblGcr;
	this.setData = data => {
		tblGcr.render(data);
		return self;
	}

	this.init = () => {
		tblGcr.set("#gcr", () => {}); // rc = action="#{presto.createGcr()}" oncomplete="viewPresto(xhr, status, args);" + cargar partida
	}

	const fnList = () => {
		form.reset(".ui-filter").loading();
		window.rcListOtri();
	}
	tabs.setInitEvent("list-otri", () => (tblGcr.isEmpty() && fnList()));
	tabs.setAction("list-otri", () => { form.loading(); window.rcListOtri(); });
	tabs.setAction("relist-otri", fnList);
}

export default new Otri();
