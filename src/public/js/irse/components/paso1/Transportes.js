
import sb from "../../../components/types/StringBox.js";
import observer from "../../../core/util/Observer.js";

import irse from "../../model/Irse.js";
import ruta from "../../model/Ruta.js";
import DataList from "../../../components/inputs/DataList.js";

export default class Transportes extends DataList {
	setEditable() {
		observer.subscribe("perfil", () => {
			const divMun = this.parentNode.parentNode;
			divMun.classList.toggle("hide", !irse.isMun()); // div block
			divMun.previousElementSibling.classList.toggle("hide", !irse.isMun()); // hr tag
		});
		this.setReadonly(!irse.isEditable());
	}

	setTipo(value) {
		this.setValue(value || ""); // default empty option
		const ok = ruta.isTipoVP(this.value); // is vehiculo propio
		this.form.elements.matriculaMun.setVisible(ok);
		this.form.elements.km1Mun.setVisible(ok);
	}

	import(data) { // import desde la ruta de salida
		data = data || { desp: 1 }; // mun = 1 ruta
		this.form.elements.origenMun.setValue(data.origen);
		this.form.elements.matriculaMun.setValue(irse.getMatricula());
		this.form.elements.km1Mun.setValue(data.km1);
		this.form.elements.f1Mun.setValue(data.dt1);
		this.setTipo(data.desp);
	}
	export() { // exportar como una ruta unica
		const data = { mask: 5 }; // es cartagena + principal
		data.destino = data.origen = this.form.elements.origenMun.value;
		data.desp = this.value; // tipo de desplazamiento
		data.matricula = this.form.elements.matriculaMun.value;
		data.km2 = data.km1 = this.form.elements.km1Mun.getValue(); // km1 = km2
		data.dt1 = data.dt2 = this.form.elements.f1Mun.value; // fecha llegada = fecha salida
		data.pais1 = data.pais2 = "ES"; // municipio de cartagena => ES
		return data;
	}

	connectedCallback() {
		this.addChange(ev => this.setTipo(ev.target.value));
	}
}
