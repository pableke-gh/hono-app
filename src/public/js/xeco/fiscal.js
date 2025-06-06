
import Form from "../components/forms/Form.js";
import nav from "../components/Navigation.js";

nav.ready(() => {
	const form = new Form("#xeco");

	form.querySelectorAll("a[href='report']").addClick((ev, link) => {
		form.setval("#op", "report").setval("#op2", link.getAttribute("op2")).setval("#id", link.id);
		form.fireSubmit().loading();
		ev.preventDefault();
	});
});
