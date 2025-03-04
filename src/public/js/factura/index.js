
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";

import factura from "./model/Factura.js";
import Fiscal from "./modules/Fiscal.js";
import solicitudes from "../xeco/xeco.js";

pf.ready(() => {
    const formFact = new Form("#xeco-fact");
	const fiscal = new Fiscal(formFact);
	const lineas = fiscal.getLineas();
    solicitudes(factura, formFact); // init. actions

	const fnUpdateFace = face => {
		factura.setFace(face);
		formFact.text(".grupo-gestor > .label", factura.isPlataforma() ? "Nombre de la plataforma:" : "Órgano Gestor:")
				.setVisible(".grupo-face", factura.isFace()).setVisible(".grupo-gestor", factura.isFace() || factura.isPlataforma());
	}

	const acOrganica = formFact.setAcItems("#acOrganica", term => pf.sendTerm("rcFindOrganica", term));
	const acRecibo = formFact.setAcItems("#acRecibo", term => pf.sendTerm("rcFindRecibo", term));
	formFact.onChangeInput("#subtipo", ev => fiscal.update(+ev.target.value))
			.onChangeInput("#sujeto", ev => fiscal.setSujeto(+ev.target.value))
			.onChangeInput("#face", ev => fnUpdateFace(+ev.target.value));

	formFact.addClick("a#add-linea", ev => {
		lineas.addLinea();
		ev.preventDefault();
	});

    window.loadDelegaciones = (xhr, status, args) => {
		if (pf.showAlerts(xhr, status, args))
			fiscal.setDelegationes(JSON.read(args.delegaciones));
    }

	window.viewFactura = (xhr, status, args) => {
    	if (!pf.showAlerts(xhr, status, args))
			return false; // Server error

		const data = JSON.read(args.fact);
        factura.setData(data); // Load data-model before view
		formFact.closeAlerts().resetCache().setData(data, ":not([type=hidden])")
				.setval("#nifTercero", data.nif).readonly(factura.isDisabled())
				.setVisible(".insert-only", factura.isEditable()).setVisible(".update-only", factura.isDisabled())
				.setVisible(".firmable-only", factura.isFirmable()).setVisible(".rechazable-only", factura.isRechazable())
				.setVisible(".show-recibo", factura.isRecibo()).setVisible(".show-factura", factura.isFacturable()).setVisible(".show-cp", factura.isCartaPago())
				.setVisible(".show-factura-uae", factura.isUae() && factura.isFacturable()).setVisible(".show-uae", factura.isUae())
				.setVisible(".show-gestor", factura.isFace() || factura.isPlataforma()).setVisible(".show-face", factura.isFace())
				.setVisible(".show-gaca", factura.isFirmaGaca());
		// cargo los datos del tercero y de las delegaciones
		fiscal.load(JSON.read(args.tercero), JSON.read(args.delegaciones))
				.setTercero(data.idTer, data.nif + " - " + data.tercero)
				.setSujeto(data.sujeto); // update sujeto / exento
		lineas.render(JSON.read(args.data)); // Load conceptos and iva input
		formFact.readonly(!factura.isEditableUae(), ".editable-uae"); // disable iva input
        acOrganica.setValue(data.idOrg, data.org + " - " + data.descOrg);
        acRecibo.setValue(data.idRecibo, data.acRecibo);

		fnUpdateFace(data.face); // update face inputs group
        tabs.render(".load-data", data).showTab(1); // show form tab
	}
	window.fnSend = () => {
		lineas.setLineas(); // actualizo los conceptos
		return formFact.validate(factura.validate) && lineas.save().confirm();
	}
});
