
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js"

export default class Filter extends Form {
	constructor(opts) {
		super("#xeco-filter", opts);
	}

	setEvents(solicitudes) {
		const url = solicitudes.getSolicitud().getUrl(); // url base path
		const fnLoadList = data => { solicitudes.render(data); tabs.showList(); } // render table + flush cache
		const fnCallList = () => { api.setJSON(this.getData()).json(url + "/list").then(fnLoadList); } // fetch list action
		const fnList = (estado, fmask) => { this.setData({ estado, fmask }, ".ui-filter"); fnCallList(); } // prepare filter and fetch

		// form filter handlers
		this.onKeydown(ev => ((ev.key == "Enter") && fnCallList()));
		tabs.setInitEvent("list", () => { solicitudes.isEmpty() && fnList("", "5"); });
		tabs.setAction("list", () => { this.isChanged() && fnCallList(); this.setChanged(); });
		tabs.setAction("list-all", () => { this.reset(".ui-filter"); fnCallList(); });
		tabs.setAction("relist", () => fnList("", "5"));
		tabs.setAction("vinc", () => { ("1" == this.getValueByName("estado")) ? tabs.showList() : fnList("1"); });

		// global tabs actions
		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	}
}
