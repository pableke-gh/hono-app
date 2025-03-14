
import Form from "../../components/forms/Form.js";
import pf from "../../components/Primefaces.js";
import tabs from "../../components/Tabs.js";

import uxxiec from "../model/Uxxiec.js";
import Solicitud from "../model/Solicitud.js";

function Uxxiec() {
    const form = new Form("#xeco-uxxi");
	const tblUxxiec = form.setTable("#docs-uxxi", uxxiec.getTable());
    const acUxxi = form.setAutocomplete("#uxxi", uxxiec.getAutocomplete());
	acUxxi.setSource(term => window.rcFindUxxi(pf.param("term", term)));

	this.getForm = () => form;
	this.isCached = form.isCached;
	this.init = () => {
		form.addClick("a#add-uxxi", () => {
			const doc = acUxxi.getCurrentItem();
			doc && tblUxxiec.add(doc); // Add and remove PK autocalculated in v_*_uxxiec
			acUxxi.reload(); // Reload autocomplete
		});
	}

	this.load = data => {
        acUxxi.reload(); // Reload autocomplete
		const model = Solicitud.self();
		const isEjecutable = model.setData(data).isEjecutable();
		form.setCache(data.id).setVisible(".show-ejecutable", isEjecutable); // Update view
	}

	window.loadUxxiec = (xhr, status, args) => {
        if (!window.showTab(xhr, status, args, 15))
			return false; // Server error
		tabs.setActions(document); // update links
		tblUxxiec.render(JSON.read(args.operaciones)); // Load uxxi-docs
    }
    window.saveUxxiec = (xhr, status, args) => {
        form.saveTable("#docs-json", tblUxxiec).loading();
    }
}

export default new Uxxiec();
