
import coll from "../../components/Collection.js";
import i18n from "../i18n/langs.js";
import partida from "./Partida.js";

function Partidas() {
	const self = this; //self instance

    let data; // Current data table
    this.getData = () => data;
	this.setPartidas = partidas => {
		data = partidas;
		return self;
	}
    this.setData = table => {
        const resume = table.getResume();
		self.getImporte = () => resume.imp.round(2);
        return self.setPartidas(table.getData());
    }

    this.size = () => coll.size(data);
    this.getPartida = () => partida;
    this.getImporte = () => 0;

	this.setPrincipal = () => {
		data.sort((a, b) => (b.imp - a.imp)); //orden por importe desc.
		partida.setPrincipal(data[0]); // marco la primera como principal
		return self;
	}

    this.validate = () => { // Todas las solicitudes tienen partidas a incrementar
        const valid = i18n.getValidation(); // Continue with validation without reset
		const MSG_ERR_INC = "Debe seleccionar al menos una partida a incrementar";
        return data.length ? valid.isOk() : !valid.addRequired("acOrgInc", MSG_ERR_INC);
    }
    this.validatePartida = partida => { // compruebo si la partida existía previamente
		const valid = i18n.getValidation(); // Continue with validation without reset
		if (!partida)
			return !valid.addRequired("acOrgInc", "Partida a incrementar no encontrada en el sistema.");
		return data.find(row => ((row.o == partida.o) && (row.e == partida.e)))
			? !valid.addError("acOrgInc", "notAllowed", "¡Partida ya asociada a la solicitud!")
			: true;
    }
}

export default new Partidas();
