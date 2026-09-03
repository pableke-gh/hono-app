
import tabs from "./container.js";
import Tab from "./Tab.js";
import ListTab from "./List.js";
import NavigationLink from "./Navigation.js";
import ToggleLink from "./Toggle.js";

// define custom element after Tabs initialization to avoid circular dependency
// For a valid custom element name, it must: Contain a hyphen (-)
customElements.define("tab-content", Tab, { extends: "div" });
customElements.define("tab-list", ListTab, { extends: "div" });
customElements.define("nav-link", NavigationLink, { extends: "a" });
customElements.define("toggle-link", ToggleLink, { extends: "a" });

export default tabs;
