
import tables from "./tables/tables.js";
import Action from "../../core/components/tabs/Action.js";

export default class ActionLink extends Action {
	create() { document.forms.beca.create(); }
	view() { document.forms.beca.load(tables.getSolicitudes().getCurrent()); }
	next() { this.nextElementSibling.click(); }

	list() { document.forms.flist.list(); }
	listAll() { document.forms.flist.listAll(); }
	relist() { document.forms.flist.relist(); }
	vinc() { document.forms.flist.aceptadas(); }

	execute() {// href attribute stats with #
		const action = this.getAttribute("href").substring(1);
		this[action](); // invoke method
	}
}
