
import iris from "../iris.js";
import pernocta from "../../model/gasto/Pernocta.js";
import pernoctas from "../../data/pernoctas/pernoctas.js";  

function Pernoctas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblPernoctas; // mapa de dietas

	this.setPernoctas = pernoctas => {
		_tblPernoctas.render(pernoctas);
		return self;
	}
	this.init = () => {
		_tblPernoctas = form.setTable("#pernoctas");
		_tblPernoctas.setMsgEmpty("msgPernoctasEmpty") // #{msg['msg.no.pernoctas']}
					.setBeforeRender(pernocta.beforeRender).setRender(pernocta.row).setFooter(pernocta.tfoot);
		return self;
	}
}

export default new Pernoctas();
