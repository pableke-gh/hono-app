
import pedido from "../model/Pedido.js";
import aplicacion from "../model/Aplicacion.js";
import categorias from "../data/categorias.js";
import DataList from "../../core/components/forms/DataList.js";

export default class Categoria extends DataList {
	#subcategoria = this.form.elements.subcategoria;
	#inventario = this.form.elements.inventario;
	#aplicacion = this.form.elements.aplicacion;

	#update(categoria) { // no actualizo al economica solo subcategorias e inventario
		this.#subcategoria.setArray(categorias.getSubcategorias(categoria));
		this.#inventario.parentNode.setVisible(categoria == "6");
	}
	#updateEconomica = () => {
		aplicacion.setEconomica(this.getEconomica());
		this.#aplicacion.clear();
	}

	setValue(value) { super.setValue(value); this.#update(value); }
	setEditable() { this.setDisabled(!pedido.isEditable()); }

	getEconomica() {
		return categorias.getEconomica(this.getValue(), this.#subcategoria.getValue(), this.#inventario.getValue());
	}
	loadByEconomica(economica) {
		if (!economica) return; // not changes
		const data = categorias.build(economica);
		this.setValue(data.categoria).#update(data.categoria);
		this.#subcategoria.setValue(data.subcategoria)
		this.#inventario.setValue(data.inventario);
		this.#updateEconomica();
	}

	validate() {
		const required = (this.getValue() == 2) && (this.#subcategoria.getValue() == 1);
		const msg = "Si los trabajos consisten en grandes reparaciones que afecten a la estructura del edificio (fachada, cubierta, etc.) y su importe estimado total (sin IVA) pueda superar los 40 mil euros, debe tramitarse a través del Servicio de Contratación.";
		return !required || window.confirm(msg);
	}
	toFormData(fd) {
		super.toFormData(fd); // categoria == this.value
		fd.set("eco", this.getEconomica()); // calculated
	}

	connectedCallback() { // init. component
		this.addChange(ev => { this.#update(ev.target.value); this.#updateEconomica(); });
		this.#subcategoria.addChange(this.#updateEconomica);
		this.#inventario.addChange(this.#updateEconomica);
	}
}
