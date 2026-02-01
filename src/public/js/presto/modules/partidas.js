
import Table from "../../components/Table.js";
import presto from "../model/Presto.js";
import partida from "../model/Partida.js";
import p030 from "./partida030.js";
import form from "../../xeco/modules/SolicitudForm.js";

class Partidas extends Table {
	constructor() {
		super(form.querySelector("#partidas-inc"), partida.getTable());
		this.setAfterRender(() => form.setEditable(presto)).set("#doc030", p030.view);
		presto.showPartidasInc = () => (presto.isTipoMultipartida() && presto.isEditable() && (this.size() < 20));
	}

	getImporte = () => this.getProp("imp");
	setPrincipal = () => {
		const data = this.getData();
		data.sort((a, b) => (b.imp - a.imp)); //orden por importe desc.
		partida.setPrincipal(data[0]); // marco la primera como principal
		return this;
	}
}

export default new Partidas();
