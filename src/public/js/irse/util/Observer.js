
class Observer {
	#events = {};

	// Subscribe to a specific event
	subscribe(event, callback) {
		if (!this.#events[event])
			this.#events[event] = [];
		this.#events[event].push(callback);
		return this;
	}

	// Unsubscribe from a specific event
	unsubscribe(event, callback) {
		const events = this.#events[event];
		const index = events ? events.indexOf(callback) : -1;
		if (index !== -1)
			events.splice(index, 1);
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
