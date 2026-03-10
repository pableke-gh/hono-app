
import coll from "../../../components/CollectionHTML.js";
import sb from "../../../components/types/StringBox.js";
import FormBase from "../../../components/forms/FormBase.js";
import api from "../../../components/Api.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";
import i18n from "../../i18n/langs.js";

import irse from "../../model/Irse.js";
import form from "../irse.js";
import Imputacion from "../tables/imputacion.js";

/*********** Fin + IBAN ***********/
export default class Paso9 extends FormBase {
	#imputacion = new Imputacion(this);
	#cuentas = this.getElement("cuentas");
	#paises = this.getElement("paises");
	#entidades = this.getElement("entidades");
	#banco = this.getElement("banco");
	#iban = this.getElement("iban");
	#swift = this.getElement("swift");

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	#pais = pais => {
		const es = (pais == "ES");
		this.#entidades.setVisible(es);
		this.#banco.setVisible(!es);
		this.setVisible(".swift-block", !es);
	}
	#toggle(cuenta) {
		if (cuenta)
			return this.querySelector("#grupo-iban").hide();
		this.querySelector("#grupo-iban").show();
		this.#pais(this.#paises.value);
	}

	init() {
		this.#imputacion.init(); // init. tabla
		tabs.setViewEvent(9, this.#imputacion.render); // always auto build table imputacion
		this.addChange("urgente", ev => this.setVisible("[data-refresh='isUrgente']", ev.target.value == "2"));

		this.#cuentas.addChange(ev => {
			const value = ev.target.value;
			this.#entidades.setValue(sb.substr(value, 4, 4));
			this.#iban.setValue(value);
			this.#swift.setValue();
			this.#toggle(value);
		});
		this.#paises.setObject(i18n.getPaises()).addChange(ev => {
			this.#pais(ev.target.value);
			this.#banco.setValue();
		});
		this.#entidades.addChange(ev => this.#banco.setValue(this.#entidades.getText()));
		this.#iban.addChange(ev => { ev.target.value = sb.toWord(ev.target.value); });
		this.#swift.addChange(ev => { ev.target.value = sb.toWord(ev.target.value); });

		const fnData = () => {
			const data = this.getData(".ui-paso9");
			data.id = irse.getId(); // solicitud actual
			data.inputacion = this.#imputacion.getData();
			return data;
		}
		tabs.setAction("save9", () => {
			if (valid.paso9()) // ok => send data and show alerts
				api.setJSON(fnData()).json("/uae/iris/paso9/save");
			this.setChanged(); // force user re-change
		});
		tabs.setAction("send", () => {
			if (!valid.paso9() || !i18n.confirm("msgFirmarEnviar")) return;
			api.setJSON(fnData()).json("/uae/iris/paso9/send").then(data => {
				form.getSolicitudes().setWorking(); // update list state
				form.setFirmas(data.firmas).setEditable(irse).refresh(irse); // update form
			});
		});
	}

	view(cuentas) {
		const iban = irse.get("iban"); // can be new in system
		const cuenta = iban ? (coll.includes(cuentas, iban) ? iban : "") : (cuentas[0] || "");
		const labels = cuentas.map(cuenta => {
			const entidad = valid.getBanks().getEntidad(cuenta);
			return entidad ? (cuenta + " - " + entidad) : cuenta;
		});

		this.#cuentas.setValues(cuentas, labels);
		// IMPORTANT! force value = "", to avoid change event return text content
		this.#cuentas.add(new Option("Dar de alta una nueva cuenta", ""));
		this.#cuentas.setValue(cuenta);

		this.#paises.setValue(irse.get("paisEntidad"));
		this.#entidades.setValue(irse.get("codigoEntidad"));
		this.#banco.setValue(irse.get("nombreEntidad"));
		this.#iban.setValue(iban || cuenta);
		this.#swift.setValue(irse.get("swift"));
		this.#toggle(cuenta);

		this.setValue("urgente", irse.isUrgente() ? "2" : "1") // 1 = normal / 2 = urgente
			.setValue("fMax", irse.get("fMax")).setValue("extra", irse.get("extra"))
			.setValue("observaciones", irse.get("observaciones"));
	}
}
