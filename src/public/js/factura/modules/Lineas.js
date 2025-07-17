
import factura from "../model/Factura.js";
import xeco from "../../xeco/xeco.js";

function Lineas() {
	const self = this; //self instance
	const form = xeco.getForm();
	const linea = factura.getLinea();

	const lineas = form.setTable("#lineas-fact", linea.getTable());
	lineas.set("show-factura", factura.isFacturable).set("show-cp", factura.isCartaPago);
	lineas.setAfterRender(() => {
		const fnChangeIva = ev => self.setIva(+ev.target.value);
		form.setLabels("#iva", [0, 4, 10, 21]).setField("#iva", factura.getIva(), fnChangeIva);
		self.setIva(factura.getIva());
	});

	this.setIva = iva => {
		factura.setIva(iva);
		const resume = lineas.getResume();
		resume.impIva = resume.imp * (iva / 100);
		resume.impTotal = resume.imp + resume.impIva; // total conceptos + importe iva
		lineas.refreshFooter(); // actualizo los totales de la subtabla de conceptos
	}

	this.getTable = () => lineas
	this.setLineas = data => { lineas.render(data); }

	this.init = () => {
		form.addClick("a#add-linea", ev => { // add linea action
			const data = form.validate(linea.validate);
			if (data)
				form.restart("#desc").setval("#imp", 0).setval("#memo", lineas.push(data).getItem(0).desc);
			ev.preventDefault();
		});
	}
}

export default new Lineas();
