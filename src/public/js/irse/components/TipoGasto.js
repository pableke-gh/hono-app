
import DataList from "../../components/inputs/DataList.js";
import gasto from "../model/Gasto.js";
import GrupoGasto from "./GrupoGasto.js";

export default class TipoGasto extends DataList {
	#grupo = this.parentNode.parentNode; // GrupoGasto instance

	connectedCallback() {
		this.addChange(this.update);
	}

	isTicket = () => gasto.isTipoTicket(this.value);
	isPernocta = () => gasto.isTipoPernocta(this.value);
	isDoc = () => gasto.isTipoDoc(this.value);
	isExtra = () => gasto.isTipoExtra(this.value);
	isTaxi = () => gasto.isTipoTaxi(this.value);

	update = () => {
		if (this.isPernocta())
			this.#grupo.setPernocta();
		else if (this.isDoc())
			this.#grupo.setDoc();
		else if (this.isExtra())
			this.#grupo.setExtra();
		else if (this.isTaxi()) //ISU y taxi
			this.#grupo.setTaxi();
		else if (this.getValue()) // ticket
			this.#grupo.setTicket();
		else
			this.#grupo.setDefault();
	}

	reset() {
		this.#grupo.reset();
		this.form.elements["fileGasto"].reset();
		super.reset();
	}
}

customElements.define("grupo-gasto", GrupoGasto, { extends: "div" });
