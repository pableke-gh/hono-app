
import iris from "../iris.js";
import transporte from "../../model/gasto/Transporte.js";

function Transportes() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblTransporte; // mapa de dietas

	this.setTransportes = transportes => {
		_tblTransporte.render(transportes);
		form.setVisible(".block-transportes", _tblTransporte.size() > 0);
		return self;
	}
	this.init = () => {
		_tblTransporte = form.setTable("#transportes");
		_tblTransporte.setMsgEmpty("msgTransportesEmpty") // #{msg['msg.no.fac.tickets']} 
					.setBeforeRender(transporte.beforeRender).setRender(transporte.row).setFooter(transporte.tfoot);
		return self;
	}
}

export default new Transportes();
