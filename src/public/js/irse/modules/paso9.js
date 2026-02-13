
import sb from "../../components/types/StringBox.js";
import valid from "../i18n/validators.js";
import i18n from "../i18n/langs.js";
import Form from "./form.js";

class Paso9 extends Form {
	constructor() {
		super(); // call super before to use this reference
	}

	initTab = tab => { // Init tab 9: IBAN
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

export default new Paso9();
