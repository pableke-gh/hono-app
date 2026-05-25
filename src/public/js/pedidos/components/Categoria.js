
import DataList from "../../components/inputs/DataList.js";
import pedido from "../model/Pedido.js";
import aplicacion from "../model/Aplicacion.js";
import categorias from "../data/categorias.js";

export default class Categoria extends DataList {
	#subcategoria = this.form.elements["subcategoria"];
	#inventario = this.form.elements["inventario"];
	#aplicacion = this.form.elements["aplicacion"];
	#info = this.form.querySelector("#info-categorias");

	#setInventario(categoria) {
		this.#inventario.parentNode.setVisible(categoria == 6);
		aplicacion.setEconomica(this.getEconomica());
	}
	#updateSubcategoria(value) {
		const text = categorias.getInfo(this.getValue(), value);
		this.#setInventario(this.getValue());
		this.#info.setVisible(text).setText(text);
	}
	#setSubcategoria(categoria) {
		this.#subcategoria.setArray(categorias.getSubcategorias(categoria));
		this.#updateSubcategoria(this.#subcategoria.getValue());
	}

	load(data) { this.#setSubcategoria(super.load(data).getValue()); }
	setEditable() { this.setDisabled(!pedido.isEditable()); }

	getEconomica() {
		return categorias.getEconomica(this.getValue(), this.#subcategoria.getValue(), this.#inventario.getValue());
	}
	loadByEconomica(economica) {
		if (!economica) return; // not changes
		const data = categorias.build(economica);
		this.setValue(data.categoria).#setSubcategoria(data.categoria);
		this.#subcategoria.setValue(data.subcategoria)
		this.#updateSubcategoria(data.subcategoria);
		this.#inventario.setValue(data.inventario);
		this.#aplicacion.clear();
	}

	validate() {
		const required = (this.getValue() == 2) && (this.#subcategoria.getValue() == 1);
		const msg = "Si los trabajos consisten en grandes reparaciones que afecten a la estructura del edificio (fachada, cubierta, etc.) y su importe estimado total (sin IVA) pueda superar los 40 mil euros, debe tramitarse a través del Servicio de Contratación.";
		return !required || window.confirm(msg);
	}
	addFormData(fd) {
		super.addFormData(fd); // categoria == this.value
		fd.set("eco", this.getEconomica()); // calculated
	}

	connectedCallback() { // init. component
		this.addChange(ev => { this.#setSubcategoria(ev.target.value); this.#aplicacion.clear(); });
		this.#subcategoria.addChange(ev => { this.#updateSubcategoria(ev.target.value); this.#aplicacion.clear(); });
		this.#inventario.addChange(ev => { aplicacion.setEconomica(this.getEconomica()); this.#aplicacion.clear(); });
		this.#subcategoria.setEditable = this.#inventario.setEditable = this.setEditable; // Override
	}
}
