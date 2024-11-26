
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import factura from "../../model/xeco/Factura.js";
import fiscal from "../../model/xeco/factura/Fiscal.js";
import solicitudes from "./xeco.js";

pf.ready(() => {
	const linea = factura.getLinea();

	const fnCalcIva = iva => {
		factura.setIva(iva);
		const resume = lineas.getResume();
		const impIva = resume.imp * (iva / 100);
		formFact.text("#imp-iva", i18n.isoFloat(impIva) + " €")
				.text("#imp-total", i18n.isoFloat(resume.imp + impIva) + " €");
	}
	const updateSujeto = sujeto => {
		factura.setSujeto(sujeto);
		formFact.setVisible(".grupo-exento", factura.isExento());
	}
	const updateFace = face => {
		factura.setFace(face);
		formFact.text(".grupo-gestor > .label", factura.isPlataforma() ? "Nombre de la plataforma:" : "Órgano Gestor:")
				.setVisible(".grupo-face", factura.isFace()).setVisible(".grupo-gestor", factura.isFace() || factura.isPlataforma());
	}
	const updateFiscalidad = tercero => {
		if (!tercero) return; // nada que modificar
		const data = fiscal.getFiscalidad(tercero, factura); // new data
        formFact.setData(data, ".ui-fiscal"); // update fields
		updateSujeto(data.sujeto); // update sujeto inputs group
		fnCalcIva(data.iva); // update iva group
	}
	const updateView = (subtipo, tercero) => {
		factura.setSubtipo(subtipo); // actualizo el nuevo subtipo
        formFact.setval("#nifTercero", acTercero.getCode()).setVisible(".show-recibo", factura.isRecibo());
		updateFiscalidad(tercero || acTercero.getCurrentItem());
	}

	/*** FORMULARIO PRINCIPAL ***/
    const formFact = new Form("#xeco-fact");
    solicitudes(factura, formFact); // init. actions

	const delegaciones = pf.datalist(formFact, "#delegacion", "#idDelegacion", { emptyOption: "Seleccione una delegación" });
	const acTercero = formFact.setAutocomplete("#acTercero", {
		delay: 500, //milliseconds between keystroke occurs and when a search is performed
		minLength: 5, //reduce matches
		source: term => pf.sendTerm("rcFindTercero", term),
		render: item => item.label,
		select: item => { pf.sendId("rcDelegaciones", item.value); return item.value },
		afterSelect: data => updateView(factura.getSubtipo(), data),
		onReset: delegaciones.reset
	});
	const acOrganica = formFact.setAcItems("#acOrganica", term => pf.sendTerm("rcFindOrganica", term));
	const acRecibo = formFact.setAcItems("#acRecibo", term => pf.sendTerm("rcFindRecibo", term));
	formFact.onChangeInput("#subtipo", ev => updateView(+ev.target.value))
			.onChangeInput("#sujeto", ev => updateSujeto(+ev.target.value))
			.onChangeInput("#face", ev => updateFace(+ev.target.value));

	const lineas = formFact.setTable("#lineas-fact", {
        msgEmptyTable: "No existen conceptos asociados a la solicitud",
        beforeRender: resume => { resume.imp = 0; resume.iva = factura.getIva(); },
        onRender: linea.row,
        onFooter: linea.tfoot,
		afterRender: resume => {
			const opts = { onChange: fnCalcIva };
			pf.datalist(formFact, "#iva", "#ivaPF", opts).setLabels([0, 4, 10, 21]).setValue(resume.iva);
		}
		//ivaChange: el => fnCalcIva(+el.value)
    });
	formFact.addClick("a#add-linea", ev => {
		const data = formFact.validate(linea.validate);
		if (data)
			formFact.restart("#desc").setval("#imp").setval("#memo", lineas.push(data).getItem(0).desc);
		ev.preventDefault();
	});

    window.loadDelegaciones = (xhr, status, args) => {
        if (pf.showAlerts(xhr, status, args))
            delegaciones.setItems(JSON.read(args.delegaciones));
    }

	window.viewFactura = (xhr, status, args) => {
        if (!pf.showAlerts(xhr, status, args))
            return false; // Server error

		const data = JSON.read(args.fact);
        factura.setData(data); // Load data-model before view
		formFact.closeAlerts().setData(data).setval("#nifTercero", data.nif).readonly(factura.isDisabled())
				.setVisible(".insert-only", factura.isEditable()).setVisible(".update-only", factura.isDisabled())
				.setVisible(".firmable-only", factura.isFirmable()).setVisible(".rechazable-only", factura.isRechazable())
				.setVisible(".show-recibo", factura.isRecibo()).setVisible(".show-factura", factura.isFacturable()).setVisible(".show-cp", factura.isCartaPago())
				.setVisible(".show-factura-uae", factura.isUae() && factura.isFacturable()).setVisible(".show-uae", factura.isUae())
				.setVisible(".show-gestor", factura.isFace() || factura.isPlataforma()).setVisible(".show-face", factura.isFace())
				.setVisible(".show-gaca", factura.isFirmaGaca());
		delegaciones.setItems(JSON.read(args.delegaciones)); // cargo las delegaciones
		lineas.render(JSON.read(args.data)); // Load conceptos and iva input
		formFact.readonly(!factura.isEditableUae(), ".editable-uae"); // disable iva input
		acTercero.setValue(data.idTer, data.nif + " - " + data.tercero);
        acOrganica.setValue(data.idOrg, data.org + " - " + data.descOrg);
        acRecibo.setValue(data.idRecibo, data.acRecibo);

		updateFace(data.face); // update face inputs group
		updateSujeto(data.sujeto); // update sujeto inputs group
		updateFiscalidad(JSON.read(args.tercero)); // datos fiscales
        tabs.render(".load-data", data).showTab(1); // show form tab
	}
	window.fnSend = () => {
		factura.setLineas(lineas);
		if (!formFact.validate(factura.validate))
			return false; // errores en la factura
		formFact.saveTable("#lineas-json", lineas);
		return i18n.confirm("msgSend") && loading();
	}
	/*** FORMULARIO PRINCIPAL ***/
});
