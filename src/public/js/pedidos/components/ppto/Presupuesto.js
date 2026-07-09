
import api from "../../../core/components/Api.js";
import FileInput from "../../../core/components/forms/FileInput.js";
import ocr from "../../services/ocr/factory.js";

/**
 * Extract text content of selected file using OCR + chatGPT
 * and autocomplete form fields with the extracted data.
 */
export default class PresupuestoFile extends FileInput {
	connectedCallback() {
		super.connectedCallback();

		this.addChange(async ev => {
			const file = this.files[0];
			if (!file) return; // no file selected

			// try to extract text with OCR (supports PDF, TIFF and images)
			const result = await ocr.read(file);
			if (result.isError()) // try to read file contents
				return this.setError("Error al leer el archivo", result.getError());

			const text = result.getData();
			console.log("text: ", text);

			api.setText(text).send("/uae/pedidos/parse").then(data => {
console.log('data: ', data);
				if (!data) return; // no data extracted

				// todo: call api to get proveedor from nif and preload form fields with the extracted data
				/*if (data.nif) { // data extracted can be incomplete or be optional
					api.init().json("/uae/pedidos/proveedor?nif=" + data.nif).then(data => {
						data.prov && this.form.getElement("proveedor").select(data.prov); // load field
					});
				}*/
			});
		});
	}
}
