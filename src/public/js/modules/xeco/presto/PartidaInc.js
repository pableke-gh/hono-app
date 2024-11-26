
import pf from "../../../components/Primefaces.js";
import presto from "../../../model/xeco/Presto.js";

export default function PartidaInc(form) {
    const self = this; //self instance
    const partida = presto.getPartida();
    const partidas = presto.getPartidas();

    const acOrgInc = form.setAcItems("#acOrgInc", //selector
                                        term => window.rcFindOrgInc(pf.param("term", term)), //source
                                        item => { form.setval("#faInc", item.int & 1); pf.sendId("rcEcoInc", item.value); }, //select
                                        () => { form.setval("#faInc").setval("#impInc"); pf.sendId("rcEcoInc"); }); //reset

    const lineas = form.setTable("#partidas-inc", {
        msgEmptyTable: "No existen partidas asociadas a la solicitud",
        beforeRender: resume => { resume.imp = 0; },
        onHeader: partida.thead,
        onRender: partida.row,
        onFooter: partida.tfoot,
        afterRender: resume => {
            partidas.setData(lineas);
            const readonly = resume.size > 0;
            form.readonly(readonly, "#ejDec").readonly(readonly || presto.isDisableEjInc(), "#ejInc")
                        .setVisible(".show-partida-inc", presto.showPartidasInc());
        }
    });

    this.getOrganica = () => acOrgInc;
    this.getEconomica = () => pf.datalist(form, "#idEcoInc", "#idEcoIncPF", { emptyOption: "Seleccione una económica" });
    this.getPartidas = () => lineas;

    this.add = partidaInc => {
        partidaInc.imp030 = partidaInc.imp = form.valueOf("#impInc"); // Importe de la partida a añadir
        lineas.add(partidaInc); // Add and remove PK autocalculated in extraeco.v_presto_partidas_inc
        acOrgInc.reload();
        return self;
    }

    this.autoload = (partida, imp) => {
        partida.imp = imp || 0; //propone un importe
        lineas.render([ partida ]); //render partida unica
        form.setval("#impDec", partida.imp);
    }

    this.save = () => {
        partidas.setPrincipal(); //marco la primera como principal
        form.saveTable("#partidas-json", lineas); // save data to send to server
        return self;
    }
}
