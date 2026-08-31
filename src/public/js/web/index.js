
import sb from "../components/types/StringBox.js";
import alerts from "../core/components/alerts/Alerts.js";
import TestForm from "./modules/test.js";
import ExcelFile from "./components/ExcelFile.js";
import OCRFile from "./components/OCRFile.js";
import Ejercicios from "../core/components/forms/MultiSelectBox.js";

import Firmas from "../core/components/layouts/Firmas.js";
import firmas from "./data/firmas.json" with { type: "json" };

// testing components
document.addEventListener("DOMContentLoaded", () => {
	Firmas.notify(firmas); // emit firmas data for testing

	window.alerts = alerts; // expose alerts for testing
	alerts.setError("This is an error message");
	alerts.addOk("This is an ok message");

	const testForm = document.forms.ftest;
	document.querySelector('a[href="#load-1"]').addEventListener("click", () => {
		testForm.load({ id: 1, pet: "chicken" }); // show form tab
	});
	document.querySelector('a[href="#load-2"]').addEventListener("click", () => {
		testForm.load({ id: 2, pet: "dog" }); // show form tab
	});

	testForm.elements.ejercicios.setLabels(sb.getEjercicios()).setFirst().render();
});

customElements.define("test-form", TestForm, { extends: "form" });
customElements.define("excel-file", ExcelFile, { extends: "input" });
customElements.define("ocr-file", OCRFile, { extends: "input" });
customElements.define("ej-list", Ejercicios, { extends: "button" });
customElements.define("firmas-block", Firmas, { extends: "div" });
