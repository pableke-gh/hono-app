
import DataList from "../../../components/inputs/DataList.js";
import observer from "../../../core/util/Observer.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";

export default class Face extends DataList {
	update = () => { // final arrow function
		const organoGestor = this.form.elements.og; // inpupt element
		const fnShowGestor = () => (factura.isFace() || factura.isPlataforma());

		organoGestor.parentNode.classList.toggle("hide", !fnShowGestor());
		organoGestor.setAttribute("maxlength", factura.isPlataforma() ? 20 : 9);
		organoGestor.previousElementSibling.innerHTML = factura.isPlataforma() ? "Nombre de la plataforma" : "Órgano Gestor";
		this.parentNode.parentNode.classList.toggle("hide", !factura.isGrupoFace());
	}

	setEditable() {
		this.setReadonly(!factura.isEditable());
	}

	connectedCallback() {
		observer.subscribe("form-updated", this.update); // update state of face inputs
		this.addChange(ev => { factura.setFace(+ev.target.value); form.refresh(factura); });
	}
}
