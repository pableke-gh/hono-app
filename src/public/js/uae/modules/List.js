
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"
import i18n from "../../i18n/langs.js";
import Base from "./Base.js";

export default class List extends Base {
	#form = new Form("#xeco-filter"); // filter form component
	#list = new Table(this.#form.getNext("table")); // table component

	view = () => { throw new Error('You have to implement the method view!'); }
	setFirmas = () => { throw new Error('You have to implement the method setFirmas!'); }

	#updateRow = () => this.#list.refreshRow(this.getModel()); // refresh current row in table
	update = () => { this.#updateRow(); tabs.showList(); } // refresh current row and go to list
	setAction = (name, fn) => { this.#list.set(name, fn); } // add handler for table

	init = () => {
		const model = this.getModel();
		const url = model.getUrl(); // url base path

		const fnReactivar = data => {
			if (!i18n.confirm("msgReactivar"))
				return; // cancel by user
			if (this.isCached(data.id))
				return tabs.showForm().invoke("reactivar");
			api.init().json(url + "/reactivar?id=" + data.id).then(data => {
				this.view(data); // update view data
				tabs.invoke("reactivar"); // show form
			});
		}
		const fnViewList = data => { this.#list.render(data); tabs.showList(); } // render table
		const fnLoadList = () => { api.setJSON(this.#form.getData()).json(url + "/list").then(fnViewList); } // fetch list action
		const fnRelist = (estado, fmask) => { this.#form.setData({ estado, fmask }, ".ui-filter"); fnLoadList(); } // prepare filter and fetch
		this.#form.onKeydown(ev => ((ev.key == "Enter") && fnLoadList()));

		// Set handlers for actions in solicitudes table
		const msgEmptyTable = "No se han encontrado solicitudes para a la búsqueda seleccionada";
		this.#list.setOptions({ msgEmptyTable, onRender: model.row, onFooter: model.tfoot }).view(); // set options + empty render

		this.#list.set("update-estado", td => { // actualizo la celda del estado
			td.className = model.getStyleByEstado() + " hide-xs table-refresh";
			td.innerHTML = model.getDescEstado();
		});

		this.#list.set("#view", data => {
			if (this.isCached(data.id))
				tabs.showForm();
			else
				api.init().json(url + "/view?id=" + data.id).then(this.view);
		});
	
		this.#list.set("#uxxiec", uxxiec.view).set("#reject", tabs.getAction("reject")); // set uxxiec and reject handlers
		this.#list.set("#firmar", data => i18n.confirm("msgFirmar") && api.init().json(url + "/firmar?id=" + data.id).then(srv => {
			if (this.isCached(data.id)) // checks if current item is cached
				this.setFirmas(srv.firmas); // update firmas blocks + buttons
			else // el usuario intenta firmar un registro desde la tabla
				this.setData(data); // load selected row
			model.setProcesando(); // avoid reclicks
			this.update(); // force tab list
		}));
		this.#list.set("#report", data => api.init().text(url + "/report?id=" + data.id).then(api.open)); // call report service
		//this.#list.set("#pdf", data => api.init().blob(url + "/pdf?id=" + data.id).then(api.open)); // report template service 

		this.#list.set("#reactivar", fnReactivar).set("#reset", fnReactivar); // acciones para reactivar / resetear solicitud
		this.#list.set("#emails", data => api.init().json(url + "/emails?id=" + data.id)); // admin test email
		this.#list.setRemove(data => api.init().json(url + "/remove?id=" + data.id).then(tabs.showList)); // remove true = confirm
		this.#list.set("#integrar", data => { // integra la solicitud seleccionada en uxxiec
			i18n.confirm("msgIntegrar") && api.init().json(url + "/ws?id=" + data.id) // confirm and send
													.then(() => model.setData(data).setProcesando()) // avoid reclicks
													.then(this.#updateRow); // update row
		});

		tabs.setInitEvent("list", () => { this.#list.isEmpty() && fnRelist("", "5"); });
		tabs.setAction("list", () => { this.#form.isChanged() && fnLoadList(); this.#form.setChanged(); });
		tabs.setAction("list-all", () => { this.#form.reset(".ui-filter"); fnLoadList(); });
		tabs.setAction("relist", () => fnRelist("", "5"));
		tabs.setAction("vinc", () => { ("1" == this.#form.getValueByName("estado")) ? tabs.showList() : fnRelist("1"); });

		tabs.setAction("ejecutar", () => uxxiec.ejecutar(this.#list.getId()).then(this.#updateRow));
		tabs.setAction("notificar", () => uxxiec.notificar(this.#list.getId()).then(this.#updateRow));

		tabs.setAction("report", () => this.#list.invoke("#report"));
		//tabs.setAction("pdf", () => this.#list.invoke("#pdf"));
		tabs.setAction("remove", this.#list.removeRow);
	}
}
