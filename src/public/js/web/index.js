
import alerts from "../core/components/Alerts.js";
import tabs from "../core/components/Tabs.js";
import ExcelFile from "./components/ExcelFile.js";

// testing components
document.addEventListener("DOMContentLoaded", () => {
	alerts.setOk("Welcome to the application!").setInfo("This is an info message.")
			.setWarn("This is a warning message.").setError("This is an error message.")
			.addOk("This is another success message.").addInfo("This is another info message.");

	window.alerts = alerts; // make alerts globally accessible for testing
	window.tabs = tabs; // make tabs globally accessible for testing
});

customElements.define("excel-file", ExcelFile, { extends: "input" });
