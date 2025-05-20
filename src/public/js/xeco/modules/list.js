
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import model from "../model/Solicitud.js";

function List() {
	const self = this; //self instance
	const form = new Form("#xeco-filter"); // filter form element

	const msgEmptyTable = "No se han encontrado solicitudes para a la búsqueda seleccionada";
	const opts = { msgEmptyTable, onRender: model.row, onFooter: model.tfoot };
	const tblSolicitudes = form.setTable("#solicitudes", opts);
	tblSolicitudes.set("is-procesable", model.isProcesable);

	this.getForm = () => form;
	this.getTable = () => tblSolicitudes;
	this.getCurrentItem = tblSolicitudes.getCurrentItem;
	this.setSolicitudes = data => { tblSolicitudes.render(data); return self; }

	const fnCallList = () => {
		setTimeout(form.loading, 1); // show loading after go new tab
		window.rcList(); // invoke list action to server
	}
	const fnList = (estado, firma) => { // prepare filter and call list action
		form.reset(".ui-filter").setStrval("#estado", estado).setStrval("#fMiFirma", firma);
		fnCallList(); // invoke list action to server
	}

	this.setProcesando = data => { // avoid reclicks
		data = data || tblSolicitudes.getCurrentItem();
		tblSolicitudes.refreshRow(model.setData(data).setProcesando());
		return self;
	}
	this.load = () => {
		form.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		const divSolicitudes = form.querySelector("#solicitudes-json");
		return self.setSolicitudes(JSON.read(divSolicitudes?.innerHTML)); // preload data
	}

	tabs.setInitEvent("list", () => (tblSolicitudes.isEmpty() && !form.getval("#estado") && fnList("", "5")));
	tabs.setAction("list", fnCallList);
	tabs.setAction("list-all", () => { form.reset(".ui-filter").loading(); window.rcList(); });
	tabs.setAction("relist", () => fnList("", "5"));
	tabs.setAction("vinc", () => {
		if ("1" == form.getval("#estado"))
			tabs.showTab("list"); // estado aceptada
		else
			fnList("1");
	});

	tabs.setAction("report", () => tblSolicitudes.invoke("#rcReport"));
	tabs.setAction("remove", tblSolicitudes.removeRow);

	window.loadFiltro = (xhr, status, args) => {
		window.showTab(xhr, status, args, "list") && self.setSolicitudes(JSON.read(args.data));
	}
}

export default new List();
