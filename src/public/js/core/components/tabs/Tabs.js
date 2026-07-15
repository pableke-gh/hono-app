
import tabs from "./TabsContainer.js";
import Tab from "./Tab.js";
import ToggleLink from "./Toggle.js";
import ListTab from "./List.js";

// define custom element after Tabs initialization to avoid circular dependency
customElements.define("tab-content", Tab, { extends: "div" });
customElements.define("toggle-link", ToggleLink, { extends: "a" });
customElements.define("tab-list", ListTab, { extends: "div" });

export default tabs;
