
import alerts from "./Alerts.js";
import mt from "../data/mime-types.js";

function Api() {
	const self = this; //self instance
	const OPTS = {}; // Call options
	const HEADER_TYPE = "content-type"; // content-type key
	const HEADER_TOKEN = "x-access-token"; // Token key in header
	const HEADERS = new Headers({ "x-requested-with": "XMLHttpRequest" }); // AJAX header

	function fnError(res, msg) {
		const error = res.statusText || msg || "Conection is not available.";
		alerts.showError(error);
		return Promise.reject(error);
	}

	this.get = name => OPTS[name];
	this.set = (name, value) => { OPTS[name] = value; return self; }
	this.init = () => {
		Object.clear(OPTS); // remove previous options
		OPTS.headers = HEADERS; // set AJAX flag
		OPTS.headers.delete(HEADER_TOKEN); // remove token
		return self.set("cache", "default"); // Default options
	}

	this.getHeaders = () => OPTS.headers;
	this.getHeader = name => OPTS.headers.get(name);
	this.setHeader = (name, value) => { OPTS.headers.set(name, value); return self; }
	this.getContentType = () => self.getHeader(HEADER_TYPE);
	this.setContentType = value => self.setHeader(HEADER_TYPE, value);
	this.getToken = () => self.getHeader(HEADER_TOKEN);// || sb.substring(headers["authorization"], 7);
	this.setToken = token => {
		//self.setHeader("authorization", "Bearer " + token);
		return self.setHeader(HEADER_TOKEN, token);
	}

	this.setMethod = method => self.set("method", method);
	this.setPost = () => self.setMethod("POST");
	this.setBody = data => self.set("body", data);
	this.setJSON = data => self.init().setPost().setBody(JSON.stringify(data));
	this.setForm = fd => self.init().setPost().setBody(fd); // param fd = FormData instance
	this.setPdf = () => self.init().setContentType(mt.pdf); // pdf type
	this.setZip = () => self.init().setContentType(mt.zip); // zip type

	this.fetch = async (url, params) => {
		self.setContentType(mt.json); // set content type header
		const query = new URLSearchParams(params); // query params
		const urlQueries = (query.size > 0) ? ("?" + query.toString()) : "";
		const res = await globalThis.fetch(url + urlQueries, OPTS); // send call
		// avoid error when json response is null: (SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input)
		return res.ok ? res.json().catch(console.error) : fnError(res); // return promise
	}

	this.text = async url => {
		alerts.loading(); // show loading indicator
		self.setContentType(mt.text); // set content type header
		const res = await globalThis.fetch(url, OPTS); // send api call
		const promise = res.ok ? res.text() : fnError(res); // get promise
		return promise.finally(alerts.working); // Add default finally functions to promise
	}
	this.json = (url, params) => {
		alerts.loading(); // show loading indicator
		return self.fetch(url, params).finally(alerts.working);
	}
	this.blob = async url => {
		alerts.loading(); // show loading indicator
		const res = await globalThis.fetch(url, OPTS); // send api call
		const objectURL = res.ok ? URL.createObjectURL(await res.blob()) : null;
		// then, catch and finally execute syncronously => revoke the object URL to free up memory at the end
		const fnFinally = () => setTimeout(() => URL.revokeObjectURL(objectURL), 1); // force last execution
		const promise = objectURL ? Promise.resolve(objectURL).finally(fnFinally) : fnError(res, "Invalid URL file.");
		return promise.finally(alerts.working); // Add default finally functions to promise
	}

	this.send = async url => {
		alerts.loading(); // show loading indicator
		const res = await globalThis.fetch(url, OPTS); // send api call
		if (!res.ok) // connection error
			return fnError(res).finally(alerts.working);
		const type = res.headers.get(HEADER_TYPE) || ""; // get response mime type
		const data = await (type.includes(mt.json) ? res.json() : res.text());
		return Promise.resolve(data).finally(alerts.working);
	}
}

export default new Api();
