
import FormBase from "../../../components/forms/FormBase.js";
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators/irse.js";
import irse from "../../model/Irse.js";
import form from "../irse.js"

/*********** subvención, congreso, asistencias/colaboraciones ***********/
export default class Paso3 extends FormBase {
	#grupoCongreso = this.querySelector(".grp-congreso"); // datos del congreso
	#grupoJustifiCong = this.#grupoCongreso.nextElementSibling; // justificacion del congreso

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		const fnSend = () => { // send data to server
			this.setChanged(); // update indicator
			const data = form.getData(".ui-isu");
			data.id = irse.getId(); // add current id
			return api.setJSON(data).json("/uae/iris/isu/save");
		}
		tabs.setAction("paso3", () => {
			if (!valid.paso3()) return; // if error => stop
			if (!irse.isEditable() || !this.isChanged())
				return tabs.next(); // go next tab directly
			fnSend().then(() => tabs.goTo(5)); // send data and go next tab
		});
		tabs.setAction("save3", () => {
			if (!valid.paso3()) return; // if error => stop
			if (!this.isChanged()) return this.setOk(); // nada que guardar
			fnSend(); // send data to server
		});
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
	}
}
