
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import factura from "../model/Factura.js";
import xeco from "../../xeco/xeco.js";

function Lineas() {
	const self = this; //self instance
	const form = xeco.getForm();

	const linea = factura.getLinea();
	const lineas = form.setTable("#lineas-fact", linea.getTable());
	lineas.setAfterRender(resume => {
		const opts = { onChange: self.setIva };
		pf.datalist(form, "#iva", "#ivaPF", opts).setLabels([0, 4, 10, 21]).setValue(resume.iva);
	});

	this.setImporteIva = (imp, iva) => {
		factura.setIva(iva);
		const impIva = imp * (iva / 100);
		form.text("#imp-iva", i18n.isoFloat(impIva) + " €")
			.text("#imp-total", i18n.isoFloat(imp + impIva) + " €");
		return self;
	}
	this.setIva = iva => {
		const resume = lineas.getResume();
		return self.setImporteIva(resume.imp, iva);
	}

	this.setLineas = data => { lineas.render(data); return self; }
	this.validate = () => {
		factura.setLineas(lineas); // actualizo los conceptos
		return form.validate(factura.validate) && form.saveTable("#lineas-json", lineas);
	}

	this.init = () => {
		xeco.setValidator(self.validate); // define validate action
		form.addClick("a#add-linea", ev => { // add linea action
			const data = form.validate(linea.validate);
			if (data)
				form.restart("#desc").setval("#imp").setval("#memo", lineas.push(data).getItem(0).desc);
			ev.preventDefault();
		});
		return self;
	}
}

export default new Lineas();
