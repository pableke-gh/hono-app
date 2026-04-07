
import i18n from "../i18n/langs.js";
import irse from "../model/Irse.js";
import form from "../modules/irse.js";
import observer from "../util/Observer.js";

// Extends HTMLElement prototype
const OPTS = { size: 1, index: 0 }; // default options
window.$1 = selector => document.querySelector(selector);
window.$$ = selector => document.querySelectorAll(selector);
HTMLElement.prototype.$1 = HTMLElement.prototype.querySelector;
HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
HTMLElement.prototype.setText = function(text) { this.innerText = text; return this; }
HTMLElement.prototype.setMsg = function(msg) { return this.setText(i18n.msg(msg)); }

export default class UpdatableElement extends HTMLElement {
	connectedCallback() { // init. component
		observer.subscribe("update", this.update);
	}

	show() { this.classList.remove("hide"); return this; }
	hide() { this.classList.add("hide"); return this; }
	setVisible = force => (force ? this.show() : this.hide());

	setText(text) { this.innerText = text; return this; }
	setMsg = msg => this.setText(i18n.msg(msg));

	render(data, opts) {
		opts = opts || OPTS; // default options
		this.dataset.template = this.dataset.template || this.innerHTML; // save current template
		this.innerHTML = i18n.render(this.dataset.template, data || irse, opts); // display new data
		return this.setVisible(opts.matches); // hide if empty
	}

	update = data => { // final arraow function
		const action = this.dataset.action; // handler name
		if (action == "text-render") // render contents
			return this.render(data);

		if (action == "clear") // clear contents
			return this.setText("");

		const callback = irse.getValue(action) || form.get(action);
		return this.setVisible(callback(this, data)); // execute action
	}
}
