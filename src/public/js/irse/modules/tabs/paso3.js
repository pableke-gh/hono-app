

import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";
import irse from "../../model/Irse.js";

/*********** subvención, congreso, asistencias/colaboraciones ***********/
export default class Paso3 extends Form {
	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		tabs.setInitEvent(3, this.initTab);
	}

	initTab = () => {
		const eCong = this.getInput("#congreso"); //congreso si/no
		const eIniCong = this.getInput("#fIniCong"); //fecha inicio del congreso
		const eFinCong = this.getInput("#fFinCong"); //fecha fin del congreso
		const eJustifiCong = this.querySelector(".justifi-congreso"); //justificacion del congreso

		const fechasCong = () => {
			eIniCong.setAttribute("max", eFinCong.value);
			eFinCong.setAttribute("min", eIniCong.value);
			eJustifiCong.setVisible(valid.congreso(eIniCong.value, eFinCong.value));
		}
		const updateCong = () => {
			const grpCongreso = this.querySelectorAll(".grp-congreso");
			if (+eCong.value > 0) {
				fechasCong();
				grpCongreso.show();
			}
			else {
				eJustifiCong.hide();
				grpCongreso.hide();
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
