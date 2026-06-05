
import api from "../../../components/Api.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import gastos from "../../model/Gastos.js";

import PrevPaso3 from "../../components/paso3/PrevPaso3.js";
import NextPaso3 from "../../components/paso3/NextPaso3.js";
import SavePaso3 from "../../components/paso3/SavePaso3.js";
import form from "../irse.js";

/** subvención, congreso, asistencias/colaboraciones **/
class Paso3 {
	init() {
		const eCong = form.getElement("congreso"); //congreso si/no
		const eIniCong = form.getElement("fIniCong"); //fecha inicio del congreso
		const eFinCong = form.getElement("fFinCong"); //fecha fin del congreso
		const grupoCongreso = eIniCong.parentNode.parentNode; // datos del congreso
		const grupoJustifiCong = grupoCongreso.nextElementSibling; // justificacion del congreso

		const fechasCong = () => {
			eIniCong.setAttribute("max", eFinCong.value);
			eFinCong.setAttribute("min", eIniCong.value);
			grupoJustifiCong.setVisible(valid.congreso(eIniCong.value, eFinCong.value));
		}
		const updateCong = () => {
			if (+eCong.value > 0) {
				fechasCong();
				grupoCongreso.show();
			}
			else {
				grupoJustifiCong.hide();
				grupoCongreso.hide();
			}
		}

		eIniCong.onblur = fechasCong;
		eFinCong.onblur = fechasCong;
		eCong.onchange = updateCong;
		updateCong();
	}

	view() {
		form.setValue("justifi", gastos.getJustifi()).setValue("justifiVp", gastos.getJustifiVp())
			.setValue("subv", gastos.getTipoSubv()).setValue("finalidad", gastos.getFinalidad()).setValue("vinc", gastos.getVinc())
			.setValue("congreso", gastos.getEstadoCongreso()).setValue("impInsc", gastos.getImpInsc())
			.setValue("fIniCong", gastos.getF1Congreso()).setValue("fFinCong", gastos.getF2Congreso())
			.setValue("justifiCong", gastos.getJustifiCong());
	}
	save() {
		form.setChanged(); // update indicator
		const data = form.getData(".ui-isu");
		data.id = irse.getId(); // add current id
		return api.setJSON(data).json("/uae/iris/isu/save");
	}
}

customElements.define("prev-paso3", PrevPaso3, { extends: "button" });
customElements.define("next-paso3", NextPaso3, { extends: "button" });
customElements.define("save-paso3", SavePaso3, { extends: "button" });

export default new Paso3();
