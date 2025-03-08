
import tb from "../../../components/types/TemporalBox.js";

import iris from "../iris.js";
import perfil from "../perfil/perfil.js";
import rutas from "../rutas/rutas.js";

import pernocta from "../../model/gasto/Pernocta.js";
import pernoctas from "../../data/pernoctas/pernoctas.js";
import paises from "../../data/paises/paises.js";
import i18n from "../../../i18n/langs.js";

function Pernoctas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component
	let _tblPernoctas; // mapa de dietas

	this.getImporte = () => 0; //_tblPernoctas.getResume().imp1;

	const fnAfterRender = resume => {
		form.setText("#imp-prenoctas", i18n.isoFloat(resume.imp1 || 0) + " €");
	}

	this.validate = data => {
		const valid = form.getValidators();
		valid.gt0("impGasto", data.impGasto)
			.isDate("fMinGasto", data.fMinGasto).isDate("fMaxGasto", data.fMaxGasto);
		if (valid.isError() || (data.fMinGasto > data.fMaxGasto))
			return !valid.addError("fMinGasto", "errFechasAloja");

		const tipo = perfil.getTipoDieta();
		const grupo = perfil.getGrupoDieta();
		const f2 = tb.trunc(form.getval("#fMaxGasto"));
		let f1 = tb.trunc(form.getval("#fMinGasto"));
		const idPais1 = rutas.getPaisPernocta(f1);
		while (tb.lt(f1, f2)) {
			const idPais = rutas.getPaisPernocta(f1);
			if (idPais != idPais1)
				return !valid.addError("#fMinGasto", "errPais");
			f1 = f1.add({ days: 1 });
		}
		data.num = tb.getDays(f1, f2);
		data.imp2 = pernoctas.getImporte(tipo, idPais1, grupo);
		data.desc = paises.getPais(pais);
		return valid.isOk();
	}

	this.setPernoctas = pernoctas => {
		_tblPernoctas.render(pernoctas);
		form.setVisible(".block-pernoctas", _tblPernoctas.size() > 0);
		return self;
	}
	this.init = () => {
		_tblPernoctas = form.setTable("#pernoctas");
		_tblPernoctas.setMsgEmpty("msgPernoctasEmpty") // #{msg['msg.no.pernoctas']}
					.setBeforeRender(pernocta.beforeRender).setRender(pernocta.row).setFooter(pernocta.tfoot)
					.setAfterRender(fnAfterRender);
		return self;
	}
}

export default new Pernoctas();
