
import tabs from "./container.js";
import ActionLink from "./Action.js";

export default class NavigationLink extends ActionLink {
	execute() {
		const tab = tabs.getCurrent();
		const href = this.getAttribute("href");
		if ((href == "#tab-back") || (href == "#tab-prev"))
			tab.prev1();
		else if (href == "#tab-next")
			tab.next1();
		else
			tab.show(href.substring(href.lastIndexOf("-") + 1));
	}
}
