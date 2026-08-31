
import tables from "../../core/components/tables/Tables.js";
import Action from "../../core/components/tabs/Action.js";

export default class ActionLink extends Action {
	create() { document.forms.pedido.create(); }
	view() { document.forms.pedido.load(tables.getSolicitudes().getCurrent()); }
	next() { this.nextElementSibling.click(); }

	list() { document.forms.flist.list(); }
	listAll() { document.forms.flist.listAll(); }
	relist() { document.forms.flist.relist(); }
	vinc() { document.forms.flist.aceptadas(); }

	ctrl1() { document.forms.fcontrol.ctrl(1); }
	ctrl2() { document.forms.fcontrol.ctrl(2); }
	ctrl3() { document.forms.fcontrol.ctrl(3); }
	ctrl4() { document.forms.fcontrol.ctrl(4); }
	ctrl5() { document.forms.fcontrol.ctrl(5); }
	rectrl() { document.forms.fcontrol.relist(); }

	execute() {// href attribute stats with #
		const action = this.getAttribute("href").substring(1);
		this[action](); // invoke method
	}
}
