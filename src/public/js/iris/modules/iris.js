
import solicitudes from "./solicitudes.js";
import Solicitud from "../../core/modules/solicitud.js";

class IrisSolicitud extends Solicitud {
	constructor() {
		super(solicitudes, solicitudes.getSolicitud());
	}
}

export default new IrisSolicitud();
