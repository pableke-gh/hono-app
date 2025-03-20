
import tabs from "../../components/Tabs.js";
import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function Presto() {
	const self = this; //self instance
	const form = xeco.getForm();

	this.getForm = xeco.getForm;
	this.getValidators = form.getValidators;
	//this.getPresto = () => presto;

	this.init = () => {
		xeco.init(); // init. actions
		tabs.setActive(presto.isUxxiec() ? "init" : "list");
		form.set("show-partida-dec", presto.isPartidaDec).set("show-imp-cd", presto.isImpCd)
			.set("show-partida-inc", presto.showPartidasInc);
		return self;
	}

	this.view = (data, firmas) => {
		data.titulo = presto.getTitulo(data.tipo); // set title for views
		xeco.view(data, firmas); // load data-model before view
		form.reset("input[id$='-json']");
		return self;
	}

	this.setFirmas = (data, firmas) => {
		data.titulo = presto.getTitulo(data.tipo); // set title for views
		xeco.setFirmas(data, firmas); // Update firmas blocks
		return self;
	}
}

export default new Presto();
