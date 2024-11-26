
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";

import uxxiec from "../../model/xeco/Uxxiec.js";
import i18n from "../../i18n/langs.js";

export default (model, formModel) => {
    /*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/
    const tabUxxi = tabs.getTab(15);
    model.setUser(tabUxxi.dataset);

    const formUxxi = new Form("#xeco-uxxi");
	const tableUxxi = formUxxi.setTable("#docs-uxxi", { // tabla de documentos uxxiec asociados
        msgEmptyTable: "No se han encontrado documentos de UXXI-EC asociadas a la solicitud",
        onRender: uxxiec.row,
        onFooter: uxxiec.tfoot
    });

    const acUxxi = formUxxi.setAutocomplete("#uxxi", {
		minLength: 4,
		source: term => window.rcFindUxxi(pf.param("term", term)),
		render: uxxiec.autocomplete,
		select: item => item.id
	});
	formUxxi.addClick("a#add-uxxi", () => {
        const doc = acUxxi.getCurrentItem();
		doc && tableUxxi.add(doc); // Add and remove PK autocalculated in v_*_uxxiec
        acUxxi.reload(); // Reload autocomplete
	});
    window.loadUxxiec = (xhr, status, args) => {
        if (window.showTab(xhr, status, args, 15))
            tableUxxi.render(JSON.read(args.operaciones)); // Load uxxi-docs
    }
    window.saveUxxiec = (xhr, status, args) => {
        formUxxi.saveTable("#docs-json", tableUxxi).loading();
    }
    /*** FORMULARIO PARA LA CREACIÓN DEL EXPEDIENTE CON UXXI-EC ***/

    /*** FORMULARIO DE RECHAZO Y FILTRO ***/
    const formReject = new Form("#xeco-reject");
    const formFilter = new Form("#xeco-filter");
    const solicitudes = formFilter.setTable("#solicitudes", {
        msgEmptyTable: "No se han encontrado solicitudes para a la búsqueda seleccionada",
        onRender: model.row,
        onFooter: model.tfoot
    });

    const fnSend = (action, data) => pf.sendId(action, data.id);
    solicitudes.set("#rcView", data => {
        if (formModel.isCached(data.id))
            tabs.showTab(1);
        else
            fnSend("rcView", data);
        formModel.setCache(data.id);
    });
    solicitudes.set("#rcFirmar", data => {
        fnSend("rcFirmar", data)
    });
    solicitudes.set("#tab-11", data => {
        if (formModel.isCached(data.id))
            return tabs.showTab(11);
        formModel.resetCache(); // force reload view
        formReject.restart("#rechazo");
        tabs.render(".load-data", data);
        fnSend("rcFirmas", data);
    });
    solicitudes.set("#rcReport", data => fnSend("rcReport", data));
    solicitudes.set("#rcUxxiec", data => {
        formUxxi.restart("#uxxi").setCache(data.id)
                .setVisible(".show-ejecutable", model.setData(data).isEjecutable()); // Update view
        tabs.render(".load-data", data);
        fnSend("rcUxxiec", data);
    });
    solicitudes.set("#rcEmails", data => fnSend("rcEmails", data));
    solicitudes.set("#rcRemove", data => fnSend("rcRemove", data));
    solicitudes.set("#rcIntegrar", (data, link) => {
        fnSend("rcIntegrar", data); // llamada al servidor
        link.hide().closest("tr").querySelectorAll(".estado").text("Procesando...");
    });
    const divSolicitudes = formFilter.querySelector("#solicitudes-json");
    solicitudes.render(JSON.read(divSolicitudes?.innerHTML)); // preload data
    formModel.resetCache(); // initialize cache

    window.onList = () => formFilter.setData({ fMiFirma: "5" }).loading();
    window.fnFirmar = () => i18n.confirm("msgFirmar") && window.loading();
    window.fnRechazar = () => formReject.validate(model.validateReject) && i18n.confirm("msgRechazar") && window.loading();

    window.loadFiltro = (xhr, status, args) => {
        window.showTab(xhr, status, args, 2) && solicitudes.render(JSON.read(args.data));
    }
    window.updateList = (xhr, status, args) => {
        if (window.showTab(xhr, status, args, 2)) {
            solicitudes.querySelectorAll(".firma-" + args.id).hide();
            solicitudes.querySelectorAll(".estado-" + args.id).text("Procesando...");
            formModel.resetCache(); // force reload view
        }
    }
    /*** FORMULARIO DE RECHAZO Y FILTRO ***/
}
