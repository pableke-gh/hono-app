
import coll from "../../components/CollectionHTML.js";
import iris from "./iris.js";
import firma from "../model/Firma.js";

function Firmas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.setFirmas = firmas => {
		const blocks = form.querySelectorAll(".ui-firmantes");
		if (firmas)
			blocks.html(coll.render(firmas, firma.render));
		else
			blocks.forEach(block => block.parentNode.hide());
		return self;
	}
	this.init = self.setFirmas;
}

export default new Firmas();
