
import DataList from "../../../components/inputs/DataList.js";
import observer from "../../../core/util/Observer.js";
import factura from "../../model/Factura.js";
import form from "../../modules/factura.js";

export default class Face extends DataList {
	update = () => { // final arrow function
		const organoGestor = this.form.elements.og; // inpupt element
		organoGestor.setVisible(factura.isFace() || factura.isPlataforma());
		organoGestor.setAttribute("maxlength", factura.isPlataforma() ? 20 : 9);
		organoGestor.previousElementSibling.innerHTML = factura.isPlataforma() ? "Nombre de la plataforma" : "Órgano Gestor";

		// show / hide grupo face
		this.form.elements.oc.setVisible(factura.isFace()); // oficina contable
		this.form.elements.ut.setVisible(factura.isFace()); // unidad tramitadora
		this.form.elements.op.setVisible(factura.isFace()); // organo proponente
		this.setVisible(factura.isGrupoFace()); // tipo de plataforma
	}

	setEditable() {
		this.setReadonly(!factura.isEditable());
	}

	connectedCallback() {
		observer.subscribe("form-updated", this.update); // update state of face inputs
		this.addChange(ev => { factura.setFace(+ev.target.value); this.update(); });
	}
}
