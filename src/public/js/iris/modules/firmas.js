
import coll from "../../components/CollectionHTML.js";
import iris from "./iris.js";
import firma from "../model/Firma.js";

function Firmas() {
	const self = this; //self instance
	const form = iris.getForm(); // form component

	this.setFirmas = firmas => {
		const blocks = form.querySelectorAll(".ui-firmantes");
		if (firmas)
			blocks.forEach(block => { block.innerHTML = coll.render(firmas, firma.render); });
		blocks.forEach(block => { block.parentNode.classList.toggle("hide", !firmas); });
		return self;
	}
	this.init = self.setFirmas;
}

export default new Firmas();
