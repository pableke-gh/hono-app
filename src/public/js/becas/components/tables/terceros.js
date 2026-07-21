
import TableHTML from "../../../core/components/tables/Table.js";
import beca from "../../model/Beca.js";

export default class Terceros extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("Sin terceros asociados a la solicitud").view();
	}

	beforeRender(resume) {
		resume.importe = 0;
	}
}
