
import sb from "../../../components/types/StringBox.js";
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";
import i18n from "../../i18n/langs.js";
import Imputacion from "../tables/imputacion.js";

/*********** Fin + IBAN ***********/
export default class Paso9 extends Form {
	#imputacion = new Imputacion(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.#imputacion.init(); // init. tabla
		tabs.setInitEvent(9, this.initTab); // init. all validations and inputs events only once
		tabs.setViewEvent(9, this.#imputacion.render); // always auto build table imputacion
	}

	initTab = tab => { // Init tab 9: IBAN
		this.#imputacion.init(); // init. table
		const cuentas = this.getElement("cuentas");
		const fnPais = pais => {
			const es = (pais == "ES");
			this.setVisible("#entidades", es).setVisible(".swift-block,#banco", !es);
		}

		this.setVisible("#grupo-iban", cuentas.options.length <= 1) // existen cuentas?
			.addChange("urgente", ev => this.setVisible("[data-refresh='isUrgente']", ev.target.value == "2"))
			.addChange("entidades", () => this.setValue("banco", this.getOptionText("entidades")))
			.addChange("paises", ev => { fnPais(ev.target.value); this.setValue("banco"); })
			.addChange("iban", ev => { ev.target.value = sb.toWord(ev.target.value); })
			.addChange("swift", ev => { ev.target.value = sb.toWord(ev.target.value); });

		cuentas.onchange = () => {
			this.setValue("iban", cuentas.value).setValue("entidades", sb.substr(cuentas.value, 4, 4))
					.setValue("swift").setVisible("#grupo-iban", !cuentas.value);
		}
		cuentas.options.forEach(opt => {
			const entidad = valid.getBanks().getEntidad(opt.innerText);
			if (entidad)
				opt.innerText += " - " + entidad;
		});
		if (!cuentas.value) {
			fnPais(this.getValue("paises"));
			tab.querySelector("#grupo-iban").show();
		}

		tabs.setAction("save9", () => { valid.paso9() && loading() && window.rcSave9(); this.setChanged(); }); // call server to save and validate
		tabs.setAction("send", () => { valid.paso9() && i18n.confirm("msgFirmarEnviar") && loading() && window.rcSend(); }); // call server to save, validate and send
	}
}
