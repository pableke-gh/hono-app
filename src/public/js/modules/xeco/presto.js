
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";
import i18n from "../../i18n/langs.js";

import presto from "../../model/xeco/Presto.js";
import PartidaDec from "./presto/PartidaDec.js"
import PartidaInc from "./presto/PartidaInc.js"
import Partida030 from "./presto/Partida030.js";
import solicitudes from "./xeco.js";

pf.ready(() => {
    const partida = presto.getPartida();
    const partidas = presto.getPartidas();
    const formPresto = new Form("#xeco-presto");

    const pInc = new PartidaInc(formPresto);
    const acOrgInc = pInc.getOrganica();
	const ecoInc = pInc.getEconomica();
    const lineas = pInc.getPartidas();

    const p030 = new Partida030();
    const form030 = p030.getForm();
    lineas.set("#doc030", p030.load);
    form030.addClick("#save-030", ev => { // Init. save 030 event
        partida.setData(lineas.getCurrentItem()); // partida actual
        if (!form030.validate(p030.validate)) // valida entrada
            return false; // Errores al validar el 030
        formPresto.saveTable("#partidas-json", lineas); // save data to send to server
        if (presto.isFinalizada())
            formPresto.click("#save030"); // actualizo los datos a integrar
        else
            tabs.backTab().showOk("Datos del documento 030 asociados correctamente."); // Back to presto view
    });

    const pDec = new PartidaDec(formPresto, lineas);
    const acOrgDec = pDec.getOrganica();
	const ecoDec = pDec.getEconomica();

    solicitudes(presto, formPresto); // init. actions
    tabs.setActive(presto.isUxxiec() ? 0 : 2);
    formPresto.onChangeInput("#idEcoDec", ev => {
        if (presto.isL83()) //L83 => busco su AIP
            formPresto.click("#autoload-l83");
        else if (presto.isAnt()) //ANT => cargo misma organica
            formPresto.click("#autoload-ant");
    });
    formPresto.onChangeInput("#impDec", ev => {
        p030.autoload(lineas, formPresto.getValue(ev.target)); //importe obligatorio
    });
    formPresto.onChangeInput("#urgente", ev => formPresto.setVisible(".grp-urgente", ev.target.value == "2"))
            .onChangeInput("#ejDec", ev => { formPresto.setval("#ejInc", ev.target.value); acOrgDec.reset(); })
            .onChangeInput("#ejInc", acOrgInc.reset);
    pf.uploads(formPresto.querySelectorAll(".pf-upload"));

    window.autoloadL83 = (xhr, status, args) => {
        const partida = JSON.read(args?.data);
        if (partida)
            pInc.autoload(partida, ecoDec.getItem(0).imp);
        else if (acOrgDec.isItem())
            formPresto.showError("Aplicación AIP no encontrada en el sistema.");
    }
    window.autoloadAnt = (xhr, status, args) => {
        const partida = JSON.read(args?.data);
        if (partida) //hay partida?
            pInc.autoload(partida, Math.max(0, partida.ih));
        else if (acOrgDec.isItem())
            formPresto.showError("No se ha encontrado el anticipo en el sistema.");
    }

    window.loadEconomicasDec = (xhr, status, args) => {
        pDec.loadEconomica(args); // carga las econonomicas a decrementar
        if (presto.isL83()) //L83 => busco su AIP
            window.autoloadL83(xhr, status, args);
        else if (presto.isAnt()) //ANT => cargo misma organica
            window.autoloadAnt(xhr, status, args);
        pDec.setAvisoFa(acOrgDec.getCurrentItem()); //aviso para organicas afectadas en TCR o FCE
    }

    /****** partida a incrementar ******/
    window.loadEconomicasInc = (xhr, status, args) => {
        ecoInc.setItems(JSON.read(args?.data)); // get items
        pDec.setAvisoFa(acOrgInc.getCurrentItem()); //aviso para organicas afectadas en TCR o FCE
    }
    /****** partida a incrementar ******/

    //****** tabla de partidas a incrementar ******//
    window.fnAddPartidaInc = () => formPresto.validate(partida.validate);
    window.loadPartidaInc = (xhr, status, args) => {
        const partidaInc = JSON.read(args.data);
        formPresto.closeAlerts().hide(".link-adjunto");
        if (partidas.setData(lineas).validatePartida(partidaInc))
            pInc.add(partidaInc);
        else
            formPresto.setErrors(); // error en la partida a incrementar
    }
    //****** tabla de partidas a incrementar ******//

    window.viewPresto = (xhr, status, args) => {
        if (!pf.showAlerts(xhr, status, args))
            return false; // Server error
        const data = JSON.read(args.presto);
        presto.setData(data); // Load data-model before view
        ecoInc.reset(); // cargo las econonomicas a incrementar
        formPresto.closeAlerts().setData(data).readonly(presto.isDisabled()).readonly(!presto.isEditableUae(), ".editable-uae")
                    .setVisible(".insert-only", presto.isEditable()).setVisible(".update-only", presto.isDisabled())
                    .setVisible(".firmable-only", presto.isFirmable()).setVisible(".rechazable-only", presto.isRechazable())
                    .setVisible(".show-partida-dec", presto.isPartidaDec()).setVisible(".show-partida-inc", presto.showPartidasInc())
                    .setVisible(".show-imp-cd", presto.isImpCd()).setVisible(".show-memoria", !presto.isL83()).setVisible(".grp-urgente", presto.isUrgente())
                    .setVisible(".show-subtipo", presto.isUae() && presto.isGcr()).setVisible(".is-fce", presto.isFce()).setVisible(".link-adjunto", presto.getAdjunto())
                    .text(".filename", "");
        pDec.loadEconomica(args); // cargo las econonomicas a decrementar
        lineas.render(JSON.read(args.data)); // Load table partidas
        acOrgDec.setValue(data.idOrgDec, data.orgDec + " - " + data.dOrgDec);
        tabs.render(".load-data", data).showTab(1);
    }
    window.fnSend = () => {
        partidas.setData(lineas); // Cargo las partidas para su validación
        return formPresto.validate(presto.validate)
                && pInc.save() 
                && i18n.confirm("msgSend")
                && formPresto.loading();
    }
});
