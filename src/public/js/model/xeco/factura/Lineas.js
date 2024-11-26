
import i18n from "../../../i18n/langs.js";
import Linea from "./Linea.js";

export default function Lineas(factura) {
	const self = this; //self instance
    const linea = new Linea(factura);

    let data; // Current presto data type
    this.getData = () => data;
    this.setData = lineas => {
        data = lineas;
        return self;
    }

    this.getLinea = () => linea;
    this.size = () => JSON.size(data);
    this.isEmpty = () => !self.size();

    this.validate = () => { // Todas las solicitudes tienen partidas a incrementar
        const valid = i18n.getValidation(); // Continue with validation without reset
        const msg = "Debe detallar los conceptos asociados a la solicitud.";
        return data.length ? valid : !valid.addError("desc", "errRequired", msg);
    }
}
