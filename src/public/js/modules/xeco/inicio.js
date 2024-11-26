
import Form from "../../components/Form.js";
import tabs from "../../components/Tabs.js";
import pf from "../../components/Primefaces.js";

pf.ready(() => {
    const formXeco = new Form("#xeco");

	const fnSourceJg = term => window.rcFindJg(pf.param("term", term)); //source
	formXeco.setAcItems("#jg", fnSourceJg);

	const fnTercero = term => window.rcFindTercero(pf.param("term", term)); //source
	formXeco.setAcItems("#tercero", fnTercero);
});

window.showAlerts = pf.showAlerts;
window.viewTab = tabs.showTab;
