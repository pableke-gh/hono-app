
import form from "../modules/factura.js";
import tables from "./tables/tables.js";
import Action from "../../core/components/tabs/Action.js";

export default class ActionLink extends Action {
	create() { form.create(); }
	factura() { form.createFactura(); }
	cartap() { form.createCartaPago(); }
	view() { form.view(tables.getSolicitudes().getCurrent()); }
	
	list() { document.forms.flist.list(); }
	listAll() { document.forms.flist.listAll(); }
	relist() { document.forms.flist.relist(); }
	vinc() { document.forms.flist.aceptadas(); }
	next() { this.nextElementSibling.click(); }

	execute() { this[this.getAttribute("href")](); }
}
