
import Tab from "../../core/components/tabs/Tab.js";
import tabs from "../../core/components/tabs/Tabs.js";

export default class TabRecibos extends Tab {
	init() {
		super.init();
		document.forms.recibos.accordion();
	}
}
