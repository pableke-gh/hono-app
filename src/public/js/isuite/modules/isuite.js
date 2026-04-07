
import FormBase from "../../components/forms/FormBase.js";
import tabs from "../../components/Tabs.js";

class IsuiteForm extends FormBase {
	constructor() {
		super("isuite"); // Must call super before 'this'
		tabs.setAction("clickNext", link => link.nextElementSibling.click()); // fire click event for next sibling element
		tabs.setAction("closeModal", link => link.closest("dialog").close()); // close modal action
	}
}

export default new IsuiteForm();
