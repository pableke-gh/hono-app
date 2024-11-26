
import Form from "../../../components/Form.js";
import Table from "../../../components/Table.js";
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";
import buzon from "../../../model/xeco/Buzon.js";

function Usuarios() {
	const self = this; //self instance
    const formUsers = new Form("#xeco-users");
	const tUsuarios = new Table("#usuarios", {
		onRender: buzon.rowUsuarios,
		onFooter: buzon.tfootUsuarios,
		onRemove: data => !pf.fetch("rcRemoveUser", { org: data.oCod, nif: data.nif })
	});

    const fnToggle = data => pf.fetch("rcToggle", { id: data.org, nif: data.nif, acc: data.acc });
	tUsuarios.set("#toggleUsers", data => { buzon.setData(data).togglePermisoUser(); fnToggle(data); });
	tUsuarios.set("#toggleGastos", data => { buzon.setData(data).toggleGastos(); fnToggle(data); });
	tUsuarios.set("#toggleIngresos", data => { buzon.setData(data).toggleIngresos(); fnToggle(data); });
	tUsuarios.set("#toggleReportProv", data => { buzon.setData(data).toggleReportProv(); fnToggle(data); });
	tUsuarios.set("#toggleFactura", data => { buzon.setData(data).toggleFactura(); fnToggle(data); });
	tabs.setAction("save-users", () => tabs.showTab(0).showOk("saveOk"));

	this.loadUsuarios = args => {
		const data = buzon.getData();
		formUsers.querySelector("#msg-org").render(data);
		const acUser = formUsers.setAcItems("#ac-usuarios", term => pf.sendTerm("rcFindUsers", term)); //selector, source
		formUsers.addClick("#add-user", ev => {
			if (acUser.isLoaded())
				pf.fetch("rcAddUser", { org: data.oCod, ut: data.ut, nif: acUser.getValue() });
			acUser.reload(); // clear data and autofocus
			ev.preventDefault();
		});
		tUsuarios.render(JSON.read(args.data));
		tabs.showTab(10);
        return self;
	}
	this.updateUsuarios = args => {
		if (args.data)
			tUsuarios.render(JSON.read(args.data));
		else
			tUsuarios.reload();
		tabs.showOk("saveOk");
        return self;
	}
	this.reloadAll = () => {
		tUsuarios.reload();
		tabs.showOk("saveOk");
        return self;
	}
}

export default new Usuarios();
