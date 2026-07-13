
import alerts from "../components/alerts/Alerts.js";

class Result {
	#data;
	#error;

	isOk = () => !this.#error;
	isError = () => !this.#data && this.#error;
	getData = () => this.#data;
	getError = () => this.#error;

	ok(data) {
		this.#data = data;
		this.#error = null;
		return this;
	}

	fail(error) {
		this.#data = null;
		this.#error = error;
		alerts.setError(error);
		return this;
	}
	error(error) {
		error = error || this.#error;
		return this.fail(error);
	}

	async catch(promise) {
		alerts.loading(); // show loading indicator
		try {
			this.ok(await promise);
		} catch(ex) {
			console.error(ex);
			this.fail(ex);
		}
		alerts.working(); // hide loading indicator
		return this;
	}
}

export default new Result();
