
import DataList from "../../components/inputs/DataList.js";
import categorias from "../data/categorias.js";

export default class Categoria extends DataList {
	#subcategoria = this.form.elements["subcategoria"];
	#inventario = this.form.elements["inventario"];
	#info = this.form.querySelector("#info-categorias");

	#setInventario = (categoria, subcategoria) => {
		const labels = categorias.getInventario(categoria, subcategoria);
		this.#inventario.setIndexed(labels).parentNode.setVisible(labels);
		this.form.getElement("organica").clear();
	}
	#updateSubcategoria = value => {
		const text = categorias.getInfo(this.getValue(), value);
		this.#setInventario(this.getValue(), value);
		this.#info.setVisible(text).setText(text);
	}
	#setSubcategoria = categoria => {
		this.#subcategoria.setIndexed(categorias.getSubcategorias(categoria));
		this.#updateSubcategoria(this.#subcategoria.getValue());
	}

	connectedCallback() { // init. component
		this.addChange(ev => this.#setSubcategoria(ev.target.value));
		this.#subcategoria.addChange(ev => this.#updateSubcategoria(ev.target.value));
	}

	load(data) {
		this.#setSubcategoria(super.load(data).getValue());
	}

	getEconomica() {
		return categorias.getEconomica(this.getValue(), this.#subcategoria.getValue(), this.#inventario.getValue());
	}

	validate() {
		const required = (this.getValue() == 2) && (this.#subcategoria.getValue() == 1);
		const msg = "Si los trabajos consisten en grandes reparaciones que afecten a la estructura del edificio (fachada, cubierta, etc.) y su importe estimado total (sin IVA) pueda superar los 40 mil euros, debe tramitarse a través del Servicio de Contratación.";
		return !required || confirm(msg);
	}
}
