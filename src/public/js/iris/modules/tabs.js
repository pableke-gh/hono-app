
import i18n from "../../i18n/langs.js";

function Tabs() {
    this.validateP1 = data => {
		const valid = i18n.getValidators();
		if (!data.objeto)
        	valid.addRequired("objeto", "errObjeto");
		return valid.isOk();
    }
}

export default new Tabs();
