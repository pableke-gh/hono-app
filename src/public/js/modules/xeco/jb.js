
import Form from "../../components/Form.js";
import modals from "../../components/Modals.js";
import pf from "../../components/Primefaces.js";

pf.ready(() => {
    const formJb = new Form("#xeco-jb");
    const fnSourceDc = term => pf.sendTerm("rcFindDcs", term);
    const fnSelect = () => formJb.click("#search");
    const fnReset = () => formJb.click("#reset");
    const acDocContable = formJb.setAcItems("#num-dc", fnSourceDc, fnSelect, fnReset);

    const fnSourceJg = term => pf.sendTerm("rcFindJgs", term);
    const acJgCm = formJb.setAcItems("#num-jg", fnSourceJg);

	modals.setViewEvent("cm", acJgCm.reload);
	modals.set("report", () => {
		pf.sendId("rcReportCm", acJgCm.getValue());
		modals.close(); // always close modal
	});

    let formDoc; // dinamyc form
    const fnBuildXecoDoc = () => {
        working(); // hide loading frame
        formDoc = new Form("#xeco-doc");
        modals.addOpenEvent(formDoc.getForm());
    }

    window.jbSearch = () => formDoc.isCached(acDocContable.getValue()) ? false : loading();
    window.jbReset = () => { loading(); acDocContable.reload(); formDoc.resetCache(); }
    window.jbLoaded = fnBuildXecoDoc;
    fnBuildXecoDoc();
});
