
import alerts from "../../../components/Alerts.js";
import pf from "../../../components/Primefaces.js";
import presto from "../../../model/xeco/Presto.js";

export default function PartidaDec(form, partidas) {
	const self = this; //self instance
    const partida = presto.getPartida();
    const ecoDec = pf.datalist(form, "#idEcoDec", "#idEcoDecPF", {
                                emptyOption: "Seleccione una económica",
                                onChange: item => form.setval("#cd", item.imp),
                                onReset: () => form.setval("#impDec").setval("#cd")
                            });

    this.getOrganica = () => {
        const fnSelectOrgDec = item => {
            presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
            form.setval("#faDec", item.int & 1);
            pf.sendId("rcEcoDec", item.value);
        }
        const fnResetOrgDec = () => {
            presto.isAutoLoadInc() && partidas.render(); //autoload => clear table
            form.setval("#faDec");
            pf.sendId("rcEcoDec");
        }

        return form.setAcItems("#acOrgDec", //selector
                                    term => window.rcFindOrgDec(pf.param("term", term)), //source
                                    fnSelectOrgDec, //select
                                    fnResetOrgDec); //reset
    }

    this.getEconomica = () => ecoDec;
    this.loadEconomica = args => ecoDec.setItems(JSON.read(args?.economicas));

    this.setAvisoFa = item => { //aviso para organicas afectadas en TCR o FCE
        const info = "La orgánica seleccionada es afectada, por lo que su solicitud solo se aceptará para determinado tipo de operaciones.";
        partida.isAfectada(item?.int) && (presto.isTcr() || presto.isFce()) && form.showInfo(info);
        alerts.working(); // Hide loading indicator
        return self;
    }
}
