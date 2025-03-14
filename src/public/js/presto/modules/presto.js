
import tabs from "../../components/Tabs.js";
import presto from "../model/Presto.js";
import xeco from "../../xeco/xeco.js";

function Presto() {
	const self = this; //self instance
	const form = xeco.getForm();

	this.getForm = xeco.getForm;
	this.getValidators = form.getValidators;

	this.init = () => {
		xeco.init(); // init. actions
		tabs.setActive(presto.isUxxiec() ? 0 : 2);
		return self;
	}
	this.view = (data, firmas) => {
		xeco.view(data, firmas); // load data-model before view
		form.reset("input[id$='-json']")
				.readonly(presto.isDisabled()).readonly(!presto.isEditableUae(), ".editable-uae")
    			.setVisible(".show-partida-dec", presto.isPartidaDec()).setVisible(".show-imp-cd", presto.isImpCd())
				.setVisible(".show-partida-inc", presto.showPartidasInc());
		return self;
	}
	this.update = firmas => {
		xeco.update(firmas); // firmas asociadas
		return self;
	}
}

export default new Presto();
