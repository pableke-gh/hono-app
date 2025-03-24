
import Form from "../../components/forms/Form.js";
import tabs from "../../components/Tabs.js";

import uxxiec from "../model/Uxxiec.js";
import model from "../model/Solicitud.js";

function Uxxiec() {
    const form = new Form("#xeco-uxxi");
	const tblUxxiec = form.setTable("#docs-uxxi", uxxiec.getTable());
    const acUxxi = form.setAutocomplete("#uxxi", uxxiec.getAutocomplete());
	acUxxi.setSource(() => window.rcFindUxxi());

	this.getForm = () => form;
	this.isCached = form.isCached;
	this.init = () => {
		const tabUxxi = tabs.getTab("uxxiec");
		model.setUser(tabUxxi.dataset);

		form.set("is-notificable", model.isNotificable);
		form.addClick("a#add-uxxi", () => {
			const doc = acUxxi.getCurrentItem();
			doc && tblUxxiec.add(doc); // Add and remove PK autocalculated in v_*_uxxiec
			acUxxi.reload(); // Reload autocomplete
		});
	}

	this.view = data => {
        acUxxi.reload(); // Reload autocomplete
		model.setData(data); // update model
		form.setCache(data.id).refresh(data); // Update form cache and view
	}
    this.save = () => {
        form.saveTable("#docs-json", tblUxxiec);
    }

	window.loadUxxiec = (xhr, status, args) => {
        if (window.showTab(xhr, status, args, "uxxiec"))
			tblUxxiec.render(JSON.read(args.operaciones)); // Load uxxi-docs
    }
}

export default new Uxxiec();
