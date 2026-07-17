
import api from "../../core/components/Api.js";
import result from "../../core/util/Result.js";

import FileInput from "../../core/components/forms/FileInput.js";
import acordeones from "./acordeones/acordeones.js";
import rb from "../lib/RecibosBancarios.js";

export default class FileBanck extends FileInput {
	connectedCallback() { // init. component
		super.connectedCallback();
		this.previousElementSibling.addEventListener("click", ev => {
			ev.preventDefault(); // preserve height scroll
			this.click(); // trigger file input on button click
		});

		this.addChange(async ev => {
			this.restart(); // clear form and table
			const file = this.files[0]; // get selected file
			if (!file) return; // no file selected => skip

			if ((await result.catch(file.text())).isError()) // try to read file contents
				return this.setError("Error al leer el archivo", "No se pudo leer el contenido del archivo.");

			const contents = result.getData(); // read file contents
			if (contents.startsWith("11")) { // cuaderno 43 / tpv
				const isTpv = window.location.search.endsWith("tpv=1"); // tpv flag in url
				return acordeones.get(isTpv ? "tpv" : "n43").setData(contents); // load accordion
			}

			if (contents.startsWith("01")) // cuaderno 57
				return acordeones.get("n57").setData(contents);

			if (contents.startsWith('{"empresa":"Flywire"')) // flywire json
				return acordeones.get("flywire").setData(contents);

			this.setError("Formato de fichero no reconocido", "No se puede procesar el contenido del fichero.");
		});
	}

	restart() {
		rb.reset(); // reset recibos bancarios
		acordeones.reset(); // reset all accordions
		this.form.restart(); // reinit. form
	}
}
