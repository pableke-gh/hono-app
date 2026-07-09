
import Form from "../components/forms/Form.js";

document.addEventListener("DOMContentLoaded", () => {
	const form = new Form("xeco");
	form.querySelectorAll("a[href='report']").addClick((ev, link) => {
		form.setValue("op", "report").setValue("op2", link.getAttribute("op2")).setValue("id", link.id).loading();
		form.getForm().submit();
		ev.preventDefault();
	});
});
