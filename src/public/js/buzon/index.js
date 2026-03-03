
import coll from "../components/CollectionHTML.js";
import tabs from "../components/Tabs.js";
import form from "./modules/buzon.js";

coll.ready(() => {
	form.init(); // init form + organicas
	const data = coll.parse(form.getText("#organicas-json"));
	form.getAncladas().setOrganicas(data).render(); // load all organicas + render ancladas
	form.getRecientes().render().paginate(form.getValue("pagina")); // render recianetes + current page size

	// global tabs actions
	tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
	tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
});
