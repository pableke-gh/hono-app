
import tabs from "../../../components/Tabs.js";
import api from "../../../components/Api.js";
import valid from "../../i18n/validators/irse.js";

import irse from "../../model/Irse.js";
import gastos from "../../model/Gastos.js";
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

		const fnSend = () => { // send data to server
			form.setChanged(); // update indicator
			const data = form.getData(".ui-isu");
			data.id = irse.getId(); // add current id
			return api.setJSON(data).json("/uae/iris/isu/save");
		}
		tabs.setAction("paso3", () => {
			if (!valid.paso3()) return; // if error => stop
			if (!irse.isEditable() || !form.isChanged())
				return tabs.next(); // go next tab directly
			fnSend().then(() => tabs.goTo(5)); // send data and go next tab
		});
		tabs.setAction("save3", () => {
			if (!valid.paso3()) return; // if error => stop
			if (!form.isChanged()) return form.setOk(); // nada que guardar
			fnSend(); // send data to server
		});
	}

	view() {
		form.setValue("justifi", gastos.getJustifi()).setValue("justifiVp", gastos.getJustifiVp())
			.setValue("subv", gastos.getTipoSubv()).setValue("finalidad", gastos.getFinalidad()).setValue("vinc", gastos.getVinc())
			.setValue("congreso", gastos.getEstadoCongreso()).setValue("impInsc", gastos.getImpInsc())
			.setValue("fIniCong", gastos.getF1Congreso()).setValue("fFinCong", gastos.getF2Congreso())
			.setValue("justifiCong", gastos.getJustifiCong());
	}
}

export default new Paso3();
