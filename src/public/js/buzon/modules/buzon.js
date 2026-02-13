
import facturas from "./facturas.js";
import Solicitud from "../../core/modules/solicitud.js";

class Buzon extends Solicitud {
	constructor() {
		super(facturas, facturas.getSolicitud());
	}

	onView(data) {
	}
}

export default new Buzon();
