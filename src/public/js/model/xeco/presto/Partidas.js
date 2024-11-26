
import coll from "../../../components/Collection.js";
import i18n from "../../../i18n/langs.js";
import Partida from "./Partida.js";

export default function Partidas(presto) {
	const self = this; //self instance
    const partida = new Partida(presto);

    let data, resume; // Current data table
    this.getData = () => data;
    this.setPartidas = partidas => {
        data = partidas;
        return self;
    }
    this.setData = table => {
        resume = table.getResume();
        return self.setPartidas(table.getData());
    }

    this.size = () => coll.size(data);
    this.getImporte = () => resume.imp.round(2);
    this.getPartida = () => partida;

    this.setPrincipal = () => {
        data.sort((a, b) => (b.imp - a.imp)); //orden por importe desc.
        data[0].mask |= 1; //marco la primera como principal
        return self;
    }

    const MSG_ERR_INC = "Debe seleccionar al menos una partida a incrementar";
    this.validate = () => { // Todas las solicitudes tienen partidas a incrementar
        const valid = i18n.getValidation(); // Continue with validation without reset
        return data.length ? valid.isOk() : !valid.addRequired("acOrgInc", MSG_ERR_INC);
    }
    this.validatePartida = partida => { // compruebo si la partida existía previamente
        const valid = i18n.getValidation(); // Continue with validation without reset
        if (!partida)
            return !valid.addRequired("acOrgInc", MSG_ERR_INC);
        if (data.find(row => ((row.o == partida.o) && (row.e == partida.e))))
            return !valid.addError("acOrgInc", "notAllowed", "¡Partida ya asociada a la solicitud!");
        return true;
    }
}
