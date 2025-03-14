
import Form from "../../components/forms/Form.js";
import Table from "../../components/Table.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import buzon from "../model/Buzon.js";
import usuario from "../model/Usuario.js";

function Usuarios() {
	const self = this; //self instance
    const form = new Form("#xeco-users");
	const tUsuarios = new Table("#usuarios", usuario.getTable());
	tUsuarios.setRemove(data => !pf.fetch("rcRemoveUser", { org: data.oCod, nif: data.nif }));

    const fnToggle = data => pf.fetch("rcToggle", { id: data.org, nif: data.nif, acc: data.acc });
	tUsuarios.set("#toggleUsers", data => { buzon.setData(data).togglePermisoUser(); fnToggle(data); });
	tUsuarios.set("#toggleGastos", data => { buzon.setData(data).toggleGastos(); fnToggle(data); });
	tUsuarios.set("#toggleIngresos", data => { buzon.setData(data).toggleIngresos(); fnToggle(data); });
	tUsuarios.set("#toggleReportProv", data => { buzon.setData(data).toggleReportProv(); fnToggle(data); });
	tUsuarios.set("#toggleFactura", data => { buzon.setData(data).toggleFactura(); fnToggle(data); });
	tabs.setAction("save-users", () => tabs.showTab(0).showOk("saveOk"));

	this.init = () => {
		const acUser = form.setAcItems("#ac-usuarios", term => pf.sendTerm("rcFindUsers", term)); //selector, source
		form.addClick("#add-user", ev => {
			if (acUser.isLoaded())
				pf.fetch("rcAddUser", { org: buzon.getOrganica(), ut: buzon.getUnidadTramit(), nif: acUser.getValue() }); 
			acUser.reload(); // clear data and autofocus
			ev.preventDefault();
		});
		return self;
	}

	// Global functions
	window.loadUsuarios = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		form.querySelector("#msg-org").render(buzon.getData());
		tUsuarios.render(JSON.read(args.data));
		tabs.showTab(10);
	}
	window.updateUsuarios = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		if (args.data)
			tUsuarios.render(JSON.read(args.data));
		tabs.showOk("saveOk");
	}
	window.reloadAll = (xhr, status, args) => {
		if (!pf.showAlerts(xhr, status, args))
			return false; // Server error
		tUsuarios.reload();
		tabs.showOk("saveOk");
	}
}

export default new Usuarios();
