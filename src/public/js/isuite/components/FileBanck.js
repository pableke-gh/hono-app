
import api from "../../core/components/Api.js";
import result from "../../core/util/Result.js";

import TpvAccordion from "./acordeones/Tpv.js";
import Norma43Accordion from "./acordeones/Norma43.js";
import Norma57Accordion from "./acordeones/Norma57.js";
import FlywireAccordion from "./acordeones/Flywire.js";
import FileInput from "../../core/components/forms/FileInput.js";

import rb from "../lib/RecibosBancarios.js";

export default class FileBanck extends FileInput {
	connectedCallback() { // init. component
		super.connectedCallback();
		this.previousElementSibling.addEventListener("click", () => this.click()); // trigger file input on button click

		this.addChange(async ev => {
			this.restart(); // clear form and table
			const file = this.files[0]; // get selected file
			if (!file) return; // no file selected => skip

			if ((await result.catch(file.text())).isError()) // try to read file contents
				return this.setError("Error al leer el archivo", "No se pudo leer el contenido del archivo.");
			const contents = result.getData(); // read file contents		

			/*if (n19.files) {
				const n19 = rb.reset().n19Parse(contents);
				Object.assign(TB_CONFIG.tables.n19, n19);
				return this.setNorma(n19, TB_CONFIG.tables.n19);
			}*/

			if (window.location.search.endsWith("tpv=1") && contents.startsWith("11")) // cuaderno 43 tpv
				return TpvAccordion.getInstance().setData(contents);

			if (contents.startsWith("11")) // cuaderno 43
				return Norma43Accordion.getInstance().setData(contents);

			if (contents.startsWith("01")) // cuaderno 57
				return Norma57Accordion.getInstance().setData(contents);

			if (contents.startsWith('{"empresa":"Flywire"')) // flywire json
				return FlywireAccordion.getInstance().setData(contents);

			this.setError("Formato de fichero no reconocido", "No se puede procesar el contenido del fichero.");
		});
	}

	restart() {
		rb.reset(); // reset recibos bancarios
		TpvAccordion.getInstance().hide();
		Norma43Accordion.getInstance().hide();
		Norma57Accordion.getInstance().hide();
		FlywireAccordion.getInstance().hide();
		this.form.restart();
	}
}

customElements.define("tpv-accordion", TpvAccordion, { extends: "div" });
customElements.define("norma43-accordion", Norma43Accordion, { extends: "div" });
customElements.define("norma57-accordion", Norma57Accordion, { extends: "div" });
customElements.define("flywire-accordion", FlywireAccordion, { extends: "div" });
