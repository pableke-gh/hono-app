
import Form from "../../../components/Form.js";
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";
import presto from "../../../model/xeco/Presto.js";
import i18n from "../../../i18n/langs.js";

export default function Partida030() {
	const self = this; //self instance
    const partida = presto.getPartida();
    const form = new Form("#xeco-030");
    const acOrg030 = form.setAcItems("#acOrg030", //selector
                                    term => window.rcFindOrg030(pf.param("term", term)), //source
                                    item => form.setval("#idEco030", item.imp)); //select

    this.getForm = () => form;
    this.validate = data030 => {
        const data = partida.getData();
        const valid = i18n.getValidators();
        if (!data) // Debo cargar previamente la partida seleccionada
            return !valid.setError("No se ha encontrado la partida asociada al documento 080.");
        const ERR_ORGANICA = "No ha seleccionado correctamente la orgánica";
        valid.isKey("acOrg030", data030.idOrg030, ERR_ORGANICA); // autocomplete required key
        valid.isKey("idEco030", data030.idEco030, "Debe seleccionar una económica"); // select required number
        valid.gt0("imp030", data030.imp030); // float number > 0
        const label = data030.acOrg030?.split(" - ");
        if (!label) // Code separator
            return !valid.addError("acOrg030", ERR_ORGANICA, "No ha seleccionada correctamente la aplicación para el DC 030.");
        if (data.imp < data030.imp030)
            return !valid.addError("imp030", "errExceeded", "El importe del documento 030 excede al del 080.");
        // If ok => update partida a incrementar
        data.idOrg030 = +data030.idOrg030;
        [ data.o030, data.dOrg030 ] = label;
        data.idEco030 = data030.idEco030;
        data.imp030 = data030.imp030;
        return valid.isOk();
    }

    this.load = row => { // load tab view 3
        row.ej030 = row.ej; // Ejercicio de la partida a añadir
        row.imp080 = i18n.isoFloat(row.imp); // formated float
        form.render(".info-080", row).setData(row).setVisible("#memo-030", presto.getMemo())
            .setVisible("#save-030", !presto.isReadOnly()).text("#memo-030", presto.getMemo());
        acOrg030.setValue(row.idOrg030, row.o030 + " - " + row.dOrg030);
        tabs.showTab(3);
        return self;
    }

    this.autoload = (lineas, imp) => {
        const partidas = lineas.getData();
        if (presto.isAutoLoadImp() && partidas.length) {
            const partida = partidas[0]; // unique row
            partida.imp = imp; //importe obligatorio
            partida.imp030 = partida.imp; // update imp 030
            lineas.render(partidas);
        }
        return self;
    }
}
