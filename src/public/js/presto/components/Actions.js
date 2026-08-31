
import form from "../modules/presto.js";
import tables from "./tables/tables.js";
import Action from "../../core/components/tabs/Action.js";

export default class ActionLink extends Action {
	create() { form.create(); }
	tcr() { form.createTcr(); }
	fce() { form.createFce(); }
	l83() { form.createL83(); }
	gcr() { form.createGcr(); }
	ant() { form.createAnt(); }
	afc() { form.createAfc(); }
	view() { form.view(tables.getSolicitudes().getCurrent()); }

	list() { document.forms.flist.list(); }
	listAll() { document.forms.flist.listAll(); }
	relist() { document.forms.flist.relist(); }
	vinc() { document.forms.flist.aceptadas(); }
	next() { this.nextElementSibling.click(); }

	execute() {// href attribute stats with #
		const action = this.getAttribute("href").substring(1);
		this[action](); // invoke method
	}
}
