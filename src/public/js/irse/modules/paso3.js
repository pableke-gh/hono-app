
import api from "../../core/components/Api.js";
import Tab from "../../core/components/tabs/Tab.js";
import valid from "../i18n/validators/irse.js";

import irse from "../model/Irse.js";
import gastos from "../model/Gastos.js";

import SavePaso3 from "../components/paso3/SavePaso3.js";
import form from "./irse.js";

/** subvención, congreso, asistencias/colaboraciones **/
export default class Paso3 extends Tab {
	#fechasCong() {
		const form = document.forms.solicitud; // HTML form
		const eCong = form.elements.congreso; //congreso si/no
		const eIniCong = form.elements.fIniCong; //fecha inicio del congreso
		const eFinCong = form.elements.fFinCong; //fecha fin del congreso
		const grupoJustifiCong = eIniCong.parentNode.parentNode.nextElementSibling; // justificacion del congreso

		eIniCong.setAttribute("max", eFinCong.value);
		eFinCong.setAttribute("min", eIniCong.value);
		grupoJustifiCong.setVisible(valid.congreso(eIniCong.value, eFinCong.value));
	}
	#updateCong() {
		const form = document.forms.solicitud; // HTML form
		const eCong = form.elements.congreso; //congreso si/no
		const eIniCong = form.elements.fIniCong; //fecha inicio del congreso
		const grupoCongreso = eIniCong.parentNode.parentNode; // datos del congreso

		if (+eCong.value > 0) {
			this.#fechasCong();
			grupoCongreso.show();
		}
		else {
			grupoCongreso.nextElementSibling.hide(); // justificacion del congreso
			grupoCongreso.hide();
		}
	}

	init() {
		super.init(); // init. tab isu (paso 3)
		const eCong = document.forms.solicitud.elements.congreso; //congreso si/no
		const eIniCong = document.forms.solicitud.elements.fIniCong; //fecha inicio del congreso
		const eFinCong = document.forms.solicitud.elements.fFinCong; //fecha fin del congreso

		eIniCong.addEventListener("blur", () => this.#fechasCong());
		eFinCong.addEventListener("blur", () => this.#fechasCong());
		eCong.addEventListener("change", () => this.#updateCong());
	}
	afterView() {
		this.#updateCong();
		form.getElement("justifi").focus(); // focus on first input
	}

	view() {
		form.setValue("justifi", gastos.getJustifi()).setValue("justifiVp", gastos.getJustifiVp())
			.setValue("subv", gastos.getTipoSubv()).setValue("finalidad", gastos.getFinalidad()).setValue("vinc", gastos.getVinc())
			.setValue("congreso", gastos.getEstadoCongreso()).setValue("impInsc", gastos.getImpInsc())
			.setValue("fIniCong", gastos.getF1Congreso()).setValue("fFinCong", gastos.getF2Congreso())
			.setValue("justifiCong", gastos.getJustifiCong());
	}

	send() {
		const data = form.setChanged().getData(".ui-isu");
		data.id = irse.getId(); // add current id as request param
		return api.setJSON(data).json("/uae/iris/isu/save");
	}
	prev1() {
		if (valid.paso3() && irse.isEditable() && form.isChanged()) // is valid change
			this.send(); // send data to server
		else // reset change flag to avoid unnecessary saves
			form.setChanged(false);
		super.prev1(); // go back tab
	}
	next1() {
		if (!valid.paso3()) return; // if error => stop
		if (!irse.isEditable() || !form.isChanged())
			return super.next1(); // go next tab directly
		this.send().then(() => super.next1()); // send data and go next tab
	}
}

customElements.define("save-paso3", SavePaso3, { extends: "button" });
