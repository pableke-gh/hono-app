
import api from "../../components/Api.js";
import FileInput from "../../components/inputs/FileInput.js";

/**
 * Extract text content of selected file using OCR + chatGPT
 * and autocomplete form fields with the extracted data.
 */
export default class PresupuestoFile extends FileInput {
	#loadForm(data) {
		if (!data) return; // no data extracted
		// todo: call api to get proveedor from nif and preload form fields with the extracted data
		if (data.nif) { // data extracted can be incomplete or be optional
			api.init().json("/uae/pedidos/proveedor?nif=" + data.nif).then(data => {
				data.prov && this.form.getElement("proveedor").select(data.prov); // load field
			});
		}
	}

	connectedCallback() {
		super.connectedCallback();

		this.addChange(async ev => {
			const file = this.files[0];
			if (!file) return; // no file selected

			const fd = this.form.getFormData();
			api.setFormData(fd).send("/uae/pedidos/parse").then(console.log);
		});
	}
}
