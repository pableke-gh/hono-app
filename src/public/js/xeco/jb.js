
import coll from "../components/CollectionHTML.js";
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import api from "../components/Api.js";

coll.ready(() => {
    const form = new Form("#xeco-jb");
    const acDocContable = form.setAutocomplete("#num-dc");
    const fnSourceDc = term => api.init().json("/uae/jb/dcs", { ej: form.getval("#ejercicio"), term }).then(acDocContable.render);
	acDocContable.setItemMode().setSource(fnSourceDc)
				.setAfterSelect(() => form.click("#search"))
				.setReset(() => form.click("#reset"));

    const acJustGast = form.setAutocomplete("#num-jg");
    const fnSourceJg = term => api.init().json("/uae/jb/jgs", { ej: form.getval("#ejercicio"), term }).then(acJustGast.render);
	acJustGast.setItemMode().setSource(fnSourceJg)

	tabs.setAction("cm", () => {
		form.showModal("dialog#cm");
		acJustGast.reload();
	});
	tabs.setAction("report", () => { // show report and close modal
		api.init().text("/uae/jb/report?jg=" + acJustGast.getValue()).then(api.open).then(form.closeModal);
	});

	const formDoc = new Form("#xeco-doc");
    const fnBuildXecoDoc = () => {
		tabs.load(formDoc.getForm()); // reload tab actions
		const ulAdjuntos = formDoc.querySelector("ul#adjuntos");
		if (ulAdjuntos && !ulAdjuntos.children.length)
			ulAdjuntos.outerText = " -";
        window.working(); // hide loading frame
	}
	window.jbReset = () => { loading(); acDocContable.reload(); }
	window.jbLoaded = fnBuildXecoDoc;
    fnBuildXecoDoc();

	tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	tabs.setAction("download", link => api.init().blob("/uae/jb/download?id=" + link.id).then(data => api.download(data, link.download)));
});
