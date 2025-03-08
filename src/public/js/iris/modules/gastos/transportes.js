
import iris from "../iris.js";
import transporte from "../../model/gasto/Transporte.js";
import i18n from "../../../i18n/langs.js";

function Transportes() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblTransporte; // mapa de dietas

	this.getImporte = () => _tblTransporte.getResume().imp1;

	const fnAfterRender = resume => {
		form.setText("#imp-trans", i18n.isoFloat(resume.imp1) + " €");
	}

	this.validate = data => {
		const valid = i18n.getValidation();
		valid.gt0("impGasto", data.impGasto);
		return valid.isOk();
	}

	this.setTransportes = transportes => {
		_tblTransporte.render(transportes);
		form.setVisible(".block-transportes", _tblTransporte.size() > 0);
		return self;
	}
	this.init = () => {
		_tblTransporte = form.setTable("#transportes");
		_tblTransporte.setMsgEmpty("msgTransportesEmpty") // #{msg['msg.no.fac.tickets']} 
					.setBeforeRender(transporte.beforeRender).setRender(transporte.row).setFooter(transporte.tfoot)
					.setAfterRender(fnAfterRender);
		return self;
	}
}

export default new Transportes();
