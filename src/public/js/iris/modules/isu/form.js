
import Form from "../../../components/forms/Form.js";
import tabs from "../../../components/Tabs.js";
import pf from "../../../components/Primefaces.js";

function FormIsu() {
    const form = new Form("#xeco-isu");

	const fnValidate = data => true;
	tabs.setAction("rcLinkJg", () => { form.validate(fnValidate) && form.sendTab(window.rcLinkJg); }); 

	this.init = () => {
		const fnSource = term => pf.sendTerm("rcSolicitudesIrse", term);
		const fnSelect = item => pf.sendId("rcLinkIrse", item.value);
		form.setAcItems("#acIrse", fnSource, fnSelect);
	}

	this.view = () => {	
	}
}

export default new FormIsu();
