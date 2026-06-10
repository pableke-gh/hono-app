
import alerts from "../core/components/Alerts.js";
import Adjunto from "./components/Adjunto.js";
import FileTest from "./components/FileTest.js";

document.addEventListener("DOMContentLoaded", () => {
	// Example usage of alerts
	alerts.setOk("Welcome to the application!").setInfo("This is an info message.")
			.setWarn("This is a warning message.").setError("This is an error message.");
	alerts.addOk("This is another success message.").addInfo("This is another info message.");
});

customElements.define("btn-file", Adjunto, { extends: "button" });
customElements.define("test-file", FileTest, { extends: "input" });
