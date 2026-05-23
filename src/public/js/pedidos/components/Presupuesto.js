
import FileInput from "../../components/inputs/FileInput.js";

/**
 * Extract text content of selected file using chatGPT
 * and autocomplete form fields with the extracted data.
 */
export default class PresupuestoFile extends FileInput {
	/*connectedCallback() {
		super.connectedCallback();
		this.addChange(ev => {
			this.readAsText().then(async contents => {
				const OPENAI_API_KEY = "";

				const response = await window.fetch("https://api.openai.com/v1/chat/completions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${OPENAI_API_KEY}`
					},
					body: JSON.stringify({
						model: "gpt-4",
						messages: [
							{
								role: "system",
								content: "You are a helpful assistant that extracts key information from budget documents."
								//content: "Eres un asistente experto en OCR que extrae información clave de facturas de proveedores."
							},
							{
								role: "user",
								content: [
									{ type: "file", filename: this.files[0].name, content: contents },
									{ type: "text", content: `Extract the following fields from this budget document:\n\n${contents}\n\nFields to extract:\n- Total Amount\n- Vendor Name\n- Due Date\n- Line Items (description, quantity, price)` }
								]
							}
						],
						max_tokens: 500
					})
				});

				const data = await response.json();
				if (response.ok)
					console.log("Extracted Data:", data.choices[0].message.content);
				else
					this.form.showError(data.error?.message || "Failed to extract data from the document. Please check the file format and try again.");
			});
		});
	}*/
}
