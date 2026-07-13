
import alerts from "../../core/components/alerts/Alerts.js";
import ocr from "../services/ocr/factory.js";
import gpt from "../services/chatGPT.js";
import FileInput from "../../core/components/forms/FileInput.js";

/**
 * Extract text content of selected file using OCR + chatGPT
 * and autocomplete form fields with the extracted data.
 */
export default class OCRFile extends FileInput {
	connectedCallback() {
		super.connectedCallback();
		this.previousElementSibling.addEventListener("click", () => this.click()); // trigger file input on button click

		this.addChange(async ev => {
			const file = this.files[0];
			if (!file) return; // no file selected

			alerts.loading(); // show loading indicator
			try {
				const text = await ocr.read(file); // try to extract text with OCR (supports PDF, TIFF and images)
				const response = await gpt.request(); // send extracted text to chatGPT for interpretation and field extraction
				console.log("text: ", text, response);
			}
			catch (ex) {
				alerts.setError(ex.message);
			}
			alerts.working(); // hide loading indicator
		});
	}
}
