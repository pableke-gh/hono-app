
import alerts from "../../core/components/Alerts.js";
import tabs from "../../core/components/Tabs.js";
import FormHTML from "../../core/components/forms/Form.js";

export default class TestForm extends FormHTML {
	load(data) {
		if (this.isCached(data.id))
			return tabs.show(0); // show form tab directly

		// simulate ajax request to server for data
		alerts.loading(); // show loading indicator
		setTimeout(() => {
			super.load(data, true); // set data to form inputs
			tabs.show(0); // show form tab
			alerts.working(); // hide working indicator
		}, 400); // load form data
	}
}
