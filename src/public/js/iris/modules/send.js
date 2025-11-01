
import sb from "../../components/types/StringBox.js";
import tabs from "../../components/Tabs.js";
import api from "../../components/Api.js";
import i18n from "../i18n/langs.js";

import iris from "../model/Iris.js";
import gastos from "../model/gasto/Gastos.js"; 
import paises from "../data/paises/paises.js";

import mgo from "./gastos/organicas.js";
import xeco from "../../xeco/xeco.js";

function Send() {
	//const self = this; //self instance
	const form = xeco.getForm(); // form component
	const _cuentas = form.getInput("#cuentas"); // select cuentas comisionado
	const _paises = form.getInput("#paises"); // select pais entidades bancarias
	const isSpain = () => (_paises.value == "ES"); // codigo = españa

	this.init = () => {
		const _entidades = form.getInput("#entidades");

		const fnCahngeCuentas = () => {
			form.setval("#iban", _cuentas.value).setval(_entidades, sb.substr(_cuentas.value, 4, 4)).setval("#swift").refresh(iris);
		}

		form.set("is-new-iban", () => !_cuentas.value).set("is-es", isSpain).set("is-zz", () => !isSpain());
		form.setDataOptions("#paises", paises.getPaises()) // update options
			.onChangeInput(_paises, () => form.refresh(iris)); // refresh fields
		form.onChangeInput("#urgente", ev => form.setVisible("[data-refresh='isUrgente']", ev.target.value == "2"))
			.onChangeInput(_entidades, ev => form.setval("#banco", form.getOptionText(ev.target)))
			.onChangeInput(_cuentas, fnCahngeCuentas);
	}

	this.view = cuentas => {
		mgo.view(); // load table organicas
		cuentas = cuentas || []; // cuentas bancarias
		form.setLabels("#cuentas", cuentas); // update options
		const bancos = i18n.getValidation().getBanks();
		_cuentas.options.forEach(opt => { // update options view
			const entidad = bancos.getEntidad(opt.innerText);
			opt.innerText += entidad ? (" - " + entidad) : "";
		});
		const option = "Dar de alta una nueva cuenta"; // todo: i18n
		_cuentas.insertAdjacentHTML("beforeend", '<option value="">' + option + '</option>');

		const aux = gastos.getCodigoIban(); // user iban
		const iban = cuentas.find(iban => (iban == aux)) || ""; // find selected iban
		iris.set("grupoDieta", gastos.getGrupoDieta()).set("cuenta", iban).set("iban", aux).set("swift", gastos.getSwift()).set("observaciones", gastos.getObservaciones()) // gastos Iban 
			.set("paisEntidad", gastos.getPaisEntidad()).set("nombreEntidad", gastos.getNombreEntidad()).set("codigoEntidad", gastos.getCodigoEntidad()); // gastos Banco
	}

	const fnValidate = data => {
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
		return valid.isOk();
	}

	const fnSend = (data, url) => {
		mgo.build(); // auto-build mono-organica
		const temp = Object.assign(iris.getData(), data); // merge data to send
		temp.gastos = gastos.setIban(data).setBanco(data).getGastos(); // update gastos
		return api.setJSON(temp).json(url); // return promise
	}
	tabs.setAction("paso9", () => {
		const data = form.validate(fnValidate);
		if (!data) // valido el formulario
			return false; // error => no hago nada
		if (i18n.confirm("msgSend")) // si hay confirmacion => envio
			fnSend(data, "/uae/iris/send").then(xeco.reset);
	});
	tabs.setAction("save9", () => {
		const data = form.validate(fnValidate);
		if (!data) // valido el formulario
			return false; // error => no hago nada
		if (form.isChanged()) // si ahy cambios => envio
			fnSend(data, "/uae/iris/save");
		else
			form.nextTab(9);
		form.setChanged(); // avoid recall
	});
}

export default new Send();
