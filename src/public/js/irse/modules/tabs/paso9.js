
import sb from "../../../components/types/StringBox.js";
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import valid from "../../i18n/validators.js";
import i18n from "../../i18n/langs.js";

import Imputacion from "../tables/imputacion.js";
import form from "../irse.js"

/*********** Fin + IBAN ***********/
export default class Paso9 extends Form {
	#imputacion = new Imputacion(this);

	constructor(form) {
		super(form.getForm(), form.getOptions());
	}

	init() {
		this.#imputacion.init(); // init. tabla
		tabs.setInitEvent(9, this.initTab); // init. all validations and inputs events only once
		tabs.setViewEvent(9, () => this.#imputacion.render(form.getOrganicas().getFirst())); // always auto build table imputacion
	}

	initTab = tab => { // Init tab 9: IBAN
		this.#imputacion.init(); // init. table
		const cuentas = this.getInput("#cuentas");
		const fnPais = pais => {
			const es = (pais == "ES");
			this.setVisible("#entidades", es).setVisible(".swift-block,#banco", !es);
		}

		this.setVisible("#grupo-iban", cuentas.options.length <= 1) // existen cuentas?
			.onChangeInput("#urgente", ev => this.setVisible(".grp-urgente", ev.target.value == "2"))
			.onChangeInput("#entidades", () => this.setval("#banco", this.getOptionText("#entidades")))
			.onChangeInput("#paises", ev => { fnPais(ev.target.value); this.setval("#banco"); })
			.onChangeInput("#iban", ev => { ev.target.value = sb.toWord(ev.target.value); })
			.onChangeInput("#swift", ev => { ev.target.value = sb.toWord(ev.target.value); });

		cuentas.onchange = () => {
			this.setval("#iban", cuentas.value).setval("#entidades", sb.substr(cuentas.value, 4, 4))
					.setval("#swift").setVisible("#grupo-iban", !cuentas.value);
		}
		cuentas.options.forEach(opt => {
			const entidad = valid.getBanks().getEntidad(opt.innerText);
			if (entidad)
				opt.innerText += " - " + entidad;
		});
		if (!cuentas.value) {
			fnPais(this.valueOf("#paises"));
			tab.querySelector("#grupo-iban").show();
		}

		window.fnPaso9 = () => valid.paso9() && loading();
		window.fnSend = () => valid.paso9() && i18n.confirm("msgFirmarEnviar") && loading();
	}
}
