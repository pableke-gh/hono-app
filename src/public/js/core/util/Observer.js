
class Observer {
	#events = {};

	// Subscribe to a specific event
	subscribe(event, callback) {
		if (!this.#events[event])
			this.#events[event] = [];
		this.#events[event].push(callback);
		return this;
	}
	subscribeHtmlElement(el, opts) { // final arrow function
		const event = el.dataset.event || "form-update"; // event name
		return this.subscribe(event, data => { // add specific event
			const action = el.dataset.refresh; // handler name
			if (action == "text-render") // render contents
				return el.render(data); // complex info
			// data must be model instance and opts = form.#opts
			const callback = data[action] || opts[action]; // callback optional => default = hide
			return callback ? el.setVisible(callback(el, data)) : el.hide(); // execute action
		});
	}

	// Unsubscribe from a specific event
	unsubscribe(event, callback) {
		const events = this.#events[event];
		const index = events ? events.indexOf(callback) : -1;
		if (index !== -1)
			events.splice(index, 1);
		return this;
	}
	remove(event) {
		delete this.#events[event];
		return this;
	}

	// Notify all observers of a specific event
	emit(event, data) {
		const events = this.#events[event];
		if (events)
			events.forEach(callback => callback(data));
		return this;
	}
}

export default new Observer();
