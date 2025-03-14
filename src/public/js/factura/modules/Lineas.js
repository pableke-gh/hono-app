
import i18n from "../../i18n/langs.js";
import pf from "../../components/Primefaces.js";
import facturas from "./facturas.js";
import factura from "../model/Factura.js";

function Lineas() {
	const self = this; //self instance
	const form = facturas.getForm();

	const linea = factura.getLinea();
	const lineas = form.setTable("#lineas-fact", {
        msgEmptyTable: "No existen conceptos asociados a la solicitud",
        beforeRender: resume => { resume.imp = 0; resume.iva = factura.getIva(); },
        onRender: linea.row,
        onFooter: linea.tfoot,
		afterRender: resume => {
			const opts = { onChange: self.setIva };
			pf.datalist(form, "#iva", "#ivaPF", opts).setLabels([0, 4, 10, 21]).setValue(resume.iva);
		}
		//ivaChange: el => self.setIva(+el.value)
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
	this.save = () => { form.saveTable("#lineas-json", lineas); return self; }
	this.confirm = () => i18n.confirm("msgSend") && loading();

	this.init = () => {
		form.addClick("a#add-linea", ev => {
			const data = form.validate(linea.validate);
			if (data)
				form.restart("#desc").setval("#imp").setval("#memo", lineas.push(data).getItem(0).desc);
			ev.preventDefault();
		});
		return self;
	}

	window.fnSend = () => {
		factura.setLineas(lineas); // actualizo los conceptos
		return form.validate(factura.validate) && self.save().confirm();
	}
}

export default new Lineas();
