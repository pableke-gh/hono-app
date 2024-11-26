
import Form from "../../../components/Form.js";
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";
import buzon from "../../../model/xeco/Buzon.js";
import i18n from "../../../i18n/langs.js";

function BuzonFacturas() {
	const self = this; //self instance
    const form = new Form("#xeco-factura");
	const elTipo = form.getInput("#tipo");
	const fileNames = form.querySelectorAll(".filename");
	let unidadTramit;

    this.getForm = () => form;
	this.setChangeTipo = fn => {
		elTipo.onchange = fn; // update event
		return self;
	}

    this.init = (cod, desc, ut) => {
		fileNames.forEach(el => { el.innerHTML = ""; });
		form.setval("#buzon-cod-org", cod).text("#org-desc", desc);
		unidadTramit = ut;
		return self;
	}
    this.setFactuaOrganica = data => {
		const isIsu = buzon.setData(data).setFacturaOtros().setTipoPago(+elTipo.value).isIsu();
		buzon.setJustPagoRequired(buzon.isPagoCesionario() && isIsu);
		form.setVisible(".show-isu", isIsu).setVisible(".show-no-isu", !isIsu)
			.setVisible("#file-jp", buzon.isJustPagoRequired())
			.setVisible(".show-cesionario", buzon.isPagoCesionario())
			.text("#type-name", form.getOptionText("#tipo")).setval("#desc");
		elTipo.onchange = () => self.setFactuaOrganica(data); // update event

		// Update tabs
		tabs.exclude();
		buzon.isMonogrupo() && tabs.exclude(4);
		tabs.exclude(5); // always hide otros
		return self;
	}
    this.setFactuaOtros = () => {
		buzon.setFacturaOtros(true).setTipoPago(+elTipo.value);
		buzon.setJustPagoRequired(buzon.isPagoCesionario());
		form.show(".show-isu").hide(".show-no-isu")
			.setVisible("#file-jp", buzon.isJustPagoRequired())
			.setVisible(".show-cesionario", buzon.isPagoCesionario())
			.text("#type-name", form.getOptionText("#tipo"));

		// Update tabs
		tabs.exclude();
		return self;
    }

    this.validateJustPago = () => {
        const files = fileNames.filter(el => el.innerHTML);
        if (buzon.isJustPagoRequired() && (files.length < 2))
            return !form.showError("Debe seleccionar Justificante de pago.");
        if (buzon.isFacturaOtros())
            return form.setval("#utFact", unidadTramit) // default ut
        return true;
    }

    this.showTab2 = () => { // tab fichero factura
        const fileName = form.querySelector(".filename").innerHTML;
        return fileName || !form.showError("Debe seleccionar una factura.");
    }

	// Tab resumen
	this.showTab6 = () => {
		const fnValidateTab5 = data => {
			const valid = i18n.getValidators();
			const msgs = "Debe detallar las observaciones para el gestor.";
			return valid.size("desc", data.desc, msgs).isOk();
		}
		return self.validateJustPago() && (tabs.isExcluded(5) || form.validate(fnValidateTab5));
	}
	this.viewTab6 = () => {
		const desc = form.getval("#desc");
		const names = fileNames.filter(el => el.innerHTML).map(el => el.innerHTML);
		form.text("#ut-desc", form.getOptionText("#utFact")).text("#file-name", names.join(", "))
			.text("#iban", form.getval("#cuentas"))
			.text("#desc-gestor", desc).setVisible("#msg-gestor", desc);
	}

	// Init. form factura
    pf.uploads(form.querySelectorAll(".pf-upload"));
	form.getInput("#fileFactura_input").setAttribute("accept", "application/pdf"); // PDF only
}

export default new BuzonFacturas();
