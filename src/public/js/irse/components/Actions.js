
import form from "../modules/irse.js";
import tables from "./tables/tables.js";
import Action from "../../core/components/tabs/Action.js";

export default class ActionLink extends Action {
	create() { form.create(); }
	view() { form.view(tables.getSolicitudes().getCurrent()); }
	next() { this.nextElementSibling.click(); }

	list() { document.forms.flist.list(); }
	listAll() { document.forms.flist.listAll(); }
	relist() { document.forms.flist.relist(); }
	vinc() { document.forms.flist.aceptadas(); }

	execute() { this[this.getAttribute("href")](); }
}
