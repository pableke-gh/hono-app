
import TableHTML from "../../../core/components/tables/Table.js";

export default class Becas extends TableHTML {
	connectedCallback() {
		this.setMsgEmpty("No existen solicitudes asociadas a la consulta").view();
	}
}
