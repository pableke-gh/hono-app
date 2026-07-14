
import tabs from "./TabsContainer.js";
import Tab from "./Tab.js";
import List from "./List.js";

// define custom element after Tabs initialization to avoid circular dependency
customElements.define("tab-content", Tab, { extends: "div" });
customElements.define("tab-list", List, { extends: "div" });

export default tabs;
