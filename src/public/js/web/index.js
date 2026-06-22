
import TestForm from "./modules/test.js";
import ExcelFile from "./components/ExcelFile.js";
import OCRFile from "./components/OCRFile.js";

import Firmas from "../core/components/Firmas.js";
import firmas from "./data/firmas.json" with { type: "json" };

// testing components
document.addEventListener("DOMContentLoaded", () => {
	Firmas.notify(firmas); // emit firmas data for testing

	const testForm = document.forms["test-form"];
	document.querySelector("a[href='#load-1']").addEventListener("click", () => {
		testForm.load({ id: 1, pet: "chicken" }); // show form tab
	});
	document.querySelector("a[href='#load-2']").addEventListener("click", () => {
		testForm.load({ id: 2, pet: "dog" }); // show form tab
	});
});

customElements.define("test-form", TestForm, { extends: "form" });
customElements.define("excel-file", ExcelFile, { extends: "input" });
customElements.define("ocr-file", OCRFile, { extends: "input" });
customElements.define("firmas-block", Firmas, { extends: "div" });
