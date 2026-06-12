
import dt from "../components/types/DateBox.js";
import alerts from "../core/components/Alerts.js";
import tabs from "../core/components/Tabs.js";

import ExcelFile from "./components/ExcelFile.js";
import OCRFile from "./components/OCRFile.js";

import Firmas from "../core/components/Firmas.js";
import firmas from "./data/firmas.json" with { type: "json" };

// testing components
document.addEventListener("DOMContentLoaded", () => {
	document.body.appendChild(alerts); // add alerts container to body
	alerts.setOk("Welcome to the application!").setInfo("This is an info message.")
			.setWarn("This is a warning message.").setError("This is an error message.")
			.addOk("This is another success message.").addInfo("This is another info message.");

	Firmas.notify(firmas); // emit firmas data for testing
	window.alerts = alerts; // make alerts globally accessible for testing
	window.tabs = tabs; // make tabs globally accessible for testing
	window.dt = dt; // make datebox type globally accessible for testing
});

customElements.define("excel-file", ExcelFile, { extends: "input" });
customElements.define("ocr-file", OCRFile, { extends: "input" });
customElements.define("firmas-block", Firmas, { extends: "div" });
