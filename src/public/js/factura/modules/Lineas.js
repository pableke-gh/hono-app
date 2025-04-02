
import i18n from "../../i18n/langs.js";
import factura from "../model/Factura.js";
import xeco from "../../xeco/xeco.js";

function Lineas() {
	const self = this; //self instance
	const form = xeco.getForm();

	const linea = factura.getLinea();
	const lineas = form.setTable("#lineas-fact", linea.getTable());
	lineas.setAfterRender(() => {
		const fnChangeIva = ev => self.setIva(+ev.target.value);
		form.setLabels("#iva", [0, 4, 10, 21]).setField("#iva", factura.getIva(), fnChangeIva);
		self.setIva(factura.getIva());
	});

	this.setIva = iva => {
		factura.setIva(iva);
		const resume = lineas.getResume();
		const impIva = resume.imp * (iva / 100);
		form.text("#imp-iva", i18n.isoFloat(impIva) + " €")
			.text("#imp-total", i18n.isoFloat(resume.imp + impIva) + " €");
		return self;
	}

	this.setLineas = data => {
		lineas.render(data);
		return self;
	}
	this.validate = () => {
		factura.setLineas(lineas); // actualizo los conceptos
		form.copy("#ivaPF", "#iva"); // set iva value in pf field
		return form.validate(factura.validate) && form.saveTable("#lineas-json", lineas);
	}

	this.init = () => {
		form.set("is-valid", self.validate); // define validate action
		form.addClick("a#add-linea", ev => { // add linea action
			const data = form.validate(linea.validate);
			if (data)
				form.restart("#desc").setval("#imp", 0).setval("#memo", lineas.push(data).getItem(0).desc);
			ev.preventDefault();
		});
		return self;
	}
}

export default new Lineas();
