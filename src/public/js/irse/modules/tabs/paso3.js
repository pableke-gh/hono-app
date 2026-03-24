
import FormBase from "../../../components/forms/FormBase.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";

/*********** subvención, congreso, asistencias/colaboraciones ***********/
export default class Paso3 extends FormBase {
	#grupoCongreso = this.querySelector(".grp-congreso"); // datos del congreso
	#grupoJustifiCong = this.#grupoCongreso.nextElementSibling; // justificacion del congreso

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	view() {
		const eCong = this.getElement("congreso"); //congreso si/no
		const eIniCong = this.getElement("fIniCong"); //fecha inicio del congreso
		const eFinCong = this.getElement("fFinCong"); //fecha fin del congreso

		const fechasCong = () => {
			eIniCong.setAttribute("max", eFinCong.value);
			eFinCong.setAttribute("min", eIniCong.value);
			this.#grupoJustifiCong.setVisible(valid.congreso(eIniCong.value, eFinCong.value));
		}
		const updateCong = () => {
			if (+eCong.value > 0) {
				fechasCong();
				this.#grupoCongreso.show();
			}
			else {
				this.#grupoJustifiCong.hide();
				this.#grupoCongreso.hide();
			}
		}

		eIniCong.onblur = fechasCong;
		eFinCong.onblur = fechasCong;
		eCong.onchange = updateCong;
		updateCong();

		tabs.setAction("paso3", () => {
			if (!valid.paso3()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged())
				return tabs.nextTab(); // go next tab directly
			loading(); window.rcPaso3(); // call server to save and calculate maps
		});
		tabs.setAction("save3", () => {
			if (!valid.paso3()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			loading(); window.rcSave3(); // call server to save and calculate maps
		});
	}
}
