
import alerts from "../../components/Alerts.js";

class Result {
	#data; #error; // single result
	//#msgs = {}; // msgs container

	/*init() {
		for (let key in this.#msgs)
			delete this.#msgs[key];
		this.#data = this.#error = null;
		return this;
	}*/

	isOk = () => !this.#error;
	isError = () => !this.#data && this.#error;
	getData = () => this.#data;
	getError = () => this.#error;
	//getMsgs = () => this.#msgs;
	/*setError(name, tip, error) {
		this.#msgs[name] = tip;
		return this.fail(error);
	}
	setRequired = (name, error) => this.setError(name, "errRequired", error);
	setFormatError = (name, error) => this.setError(name, "errFormat", error);*/

	ok(data) {
		this.#data = data;
		this.#error = null;
		return this;
	}

	fail(error) {
		this.#data = null;
		this.#error = error;
		return this;
	}
	error(error) {
		alerts.showError(error);
		return this.fail(error);
	}

	async catch(promise) {
		try {
			const data = await promise;
			return this.ok(data);
		} catch(err) {
			console.error(err);
			return this.fail(err);
		}
	}
}

export default new Result();
