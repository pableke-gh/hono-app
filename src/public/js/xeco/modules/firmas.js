
import coll from "../../components/CollectionHTML.js";
import firma from "../model/Firma.js";

function Firmas() {
	const self = this; //self instance
	const blocks = $$(".ui-firmantes");

	this.show = () => { blocks.forEach(block => block.parentNode.show()); }
	this.hide = () => { blocks.forEach(block => block.parentNode.hide()); }
	this.setFirmas = firmas => {
		if (firmas) {
			blocks.html(coll.render(firmas, firma.render));
			self.show();
		}
		else
			self.hide();
	}
}

export default new Firmas();
