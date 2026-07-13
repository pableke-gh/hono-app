
import Tab from "../../components/tabs/Tab.js";

export default class ListTab extends Tab {
	init() {
		super.init();
		document.forms.flist.list();
	}
}
