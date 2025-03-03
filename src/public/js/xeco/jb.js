
import Form from "../components/forms/Form.js";
import tabs from "../components/Tabs.js";
import pf from "../components/Primefaces.js";

pf.ready(() => {
    const formJb = new Form("#xeco-jb");
    const fnSourceDc = term => pf.sendTerm("rcFindDcs", term);
    const fnSelect = () => formJb.click("#search");
    const fnReset = () => formJb.click("#reset");
    const acDocContable = formJb.setAcItems("#num-dc", fnSourceDc, fnSelect, fnReset);

    const fnSourceJg = term => pf.sendTerm("rcFindJgs", term);
    const acJgCm = formJb.setAcItems("#num-jg", fnSourceJg);

	tabs.setViewEvent("cm", acJgCm.reload);
	tabs.setAction("report", () => {
		pf.sendId("rcReportCm", acJgCm.getValue());
		tabs.closeModal(); // always close modal
	});

    let formDoc; // dinamyc form
    const fnBuildXecoDoc = () => {
        formDoc = new Form("#xeco-doc");
        window.working(); // hide loading frame
    }

    window.jbSearch = () => formDoc.isCached(acDocContable.getValue()) ? false : loading();
    window.jbReset = () => { loading(); acDocContable.reload(); formDoc.resetCache(); }
    window.jbLoaded = fnBuildXecoDoc;
    fnBuildXecoDoc();
});
