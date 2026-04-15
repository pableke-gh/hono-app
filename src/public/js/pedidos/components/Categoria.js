
import DataList from "../../components/inputs/DataList.js";
import categorias from "../data/categorias.js";

export default class Categoria extends DataList {
	connectedCallback() { // init. component
		const subcategoria = this.form.elements["subcategoria"];
		const inventario = this.form.elements["inventario"];
		const info = this.form.querySelector("#info-categorias");

		const setInventario = (categoria, subcategoria) => {
			const labels = categorias.getInventario(categoria, subcategoria);
			inventario.setIndexed(labels).parentNode.setVisible(labels);
		}
		const updateSubcategoria = value => {
			const catval = this.getValue();
			//if ((catval == 2) && (value == 1) && !confirm("Si los trabajos consisten en grandes reparaciones que afecten a la estructura del edificio (fachada, cubierta, etc.) y su importe estimado total (sin IVA) pueda superar los 40 mil euros, debe tramitarse a través del Servicio de Contratación. "))
				//return; // no aplico los cambios
			const text = categorias.getInfo(catval, value);
			setInventario(catval, value);
			info.setVisible(text).setText(text);
		}
		const setSubcategoria = categoria => {
			subcategoria.setIndexed(categorias.getSubcategorias(categoria));
			updateSubcategoria(subcategoria.getValue());
		}

		this.addChange(ev => setSubcategoria(ev.target.value));
		subcategoria.addChange(ev => updateSubcategoria(ev.target.value));
		setSubcategoria(this.getValue());
	}
}
