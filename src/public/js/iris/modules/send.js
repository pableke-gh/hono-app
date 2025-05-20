
import tabs from "../../components/Tabs.js";
import sb from "../../components/types/StringBox.js";
import i18n from "../i18n/langs.js";

import iris from "../model/Iris.js";
import gastos from "../model/gasto/Gastos.js"; 
import paises from "../data/paises/paises.js";

import gm from "../modules/gastos/gastos.js";
import xeco from "../../xeco/xeco.js";

function Send() {
	const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _cuentas = form.getInput("#cuentas"); // select cuentas comisionado
	const _paises = form.getInput("#paises"); // select pais entidades bancarias
	const isSpain = () => (_paises.value == "ES"); // codigo = españa

	const fnSave = data => {
		if (form.isChanged())
			gm.setIban(data).setBanco(data).save();
		return true;
	}
	this.validate = data => {
		const valid = i18n.getValidators();
		valid.size50("iban", data.iban, "errIban");
		if (!_cuentas.value) {
			if (isSpain())
				valid.size("codigoEntidad", data.codigoEntidad, "errEntidad", 4);
			else
				valid.size("swift", data.swift, "errSwift").size("nombreEntidad", data.nombreEntidad);
		}
		if (data.urgente == "2") { // Solicitud urgente
			valid.size("extra", data.extra, "Debe indicar un motivo para la urgencia de esta solicitud."); // Required string
			valid.geToday("fMax", data.fMax, "Debe indicar una fecha maxima de resolución para esta solicitud."); // Required date
		}
		return valid.isOk() && fnSave(data);
	}

	tabs.setAction("paso9", () => { form.validate(self.validate) && form.sendTab(window.rcPaso9); });
	tabs.setAction("save9", () => { form.validate(self.validate) && form.sendTab(window.rcSave9, 9); });

	this.init = () => {
		const _entidades = form.getInput("#entidades");

		const fnCahngeCuentas = () => {
			form.setval("#iban", _cuentas.value).setval(_entidades, sb.substr(_cuentas.value, 4, 4)).setval("#swift").refresh(iris);
		}

		form.set("is-new-iban", () => !_cuentas.value).set("is-es", isSpain).set("is-zz", () => !isSpain());
		form.setOptions("#paises", paises.getPaises()) // update options
			.onChangeInput(_paises, () => form.refresh(iris)); // refresh fields
		form.onChangeInput("#urgente", ev => form.setVisible("[data-refresh='is-urgente']", ev.target.value == "2"))
			.onChangeInput(_entidades, ev => form.setval("#banco", form.getOptionText(ev.target)))
			.onChangeInput(_cuentas, fnCahngeCuentas);
	}

	this.view = cuentas => {
		cuentas = cuentas || [];
		const option = "Dar de alta una nueva cuenta"; // todo: i18n
		form.setLabels("#cuentas", cuentas); // update options
		_cuentas.insertAdjacentHTML("beforeend", '<option value="">' + option + '</option>');

		const aux = gastos.getCodigoIban(); // user iban
		const iban = cuentas.find(iban => (iban == aux)) || ""; // find selected iban
		iris.set("grupoDieta", gastos.getGrupoDieta()).set("cuenta", iban).set("iban", aux).set("swift", gastos.getSwift()).set("observaciones", gastos.getObservaciones()) // gastos Iban 
			.set("paisEntidad", gastos.getPaisEntidad()).set("nombreEntidad", gastos.getNombreEntidad()).set("codigoEntidad", gastos.getCodigoEntidad()); // gastos Banco
	}

	this.update = data => {
		data && self.view(data);
	}
}

export default new Send();
