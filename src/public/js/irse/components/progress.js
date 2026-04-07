
import i18n from "../i18n/langs.js";
import irse from "../model/Irse.js";
import form from "../modules/irse.js";
import observer from "../util/Observer.js";

export default class ProgressInfo extends HTMLSpanElement {
	update = () => {
		const pasos = i18n.get("lblPasos"); // template
		i18n.set("pasos", 2 + this.isIsu() + this.isMaps()); // number of steps
		this.innerHTML = i18n.render(pasos, irse); // render contents
	}

	connectedCallback() { // init. component
		observer.subscribe("perfil", this.update);
	}
}
