
import alerts from "./Alerts.js";
import mt from "../data/mime-types.js";

const fnMsgs = data => (alerts.showMsgs(data) ? data : Promise.reject(data));
function fnError(res, msg) {
	const error = res.statusText || msg || "Conection is not available.";
	alerts.showError(error);
	return Promise.reject(error);
}

function Api() {
	const self = this; //self instance
	const OPTS = {}; // Call options
	const HEADER_TYPE = "content-type"; // content-type key
	const HEADER_TOKEN = "x-access-token"; // Token key in header
	const HEADERS = new Headers({ "x-requested-with": "XMLHttpRequest" }); // AJAX header

	this.get = name => OPTS[name];
	this.set = (name, value) => { OPTS[name] = value; return self; }
	this.init = () => { // set default options
		Object.clear(OPTS);
		OPTS.headers = HEADERS;
		OPTS.headers.delete(HEADER_TYPE);
		OPTS.headers.delete(HEADER_TOKEN);
		return self.set("cache", "default");
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
	this.setPdf = () => self.init().setContentType(mt.pdf); // pdf type
	this.setZip = () => self.init().setContentType(mt.zip); // zip type
	this.setBin = () => self.init().setContentType(mt.bin); // binary type

	/**
	 * @param {FormData} fd
	 * 
	 * Set form data. If the form contains file inputs, the FormData object will automatically set the correct multipart/form-data boundary in the request.
	 * Note: When using FormData, do not manually set the Content-Type header to multipart/form-data, as this can lead to issues with how the browser formats the request.
	 */
	this.setFormData = fd => self.init().setPost().setBody(fd); // set form data
	this.setForm = form => self.setFormData(new FormData(form)); // set data by form element

	const fnFetch = (url, params) => {
		if (!params)
			return globalThis.fetch(url, OPTS); // send call
		const query = new URLSearchParams(params); // query params
		// then, catch and finally callbacks execute syncronously
		return globalThis.fetch(url + "?" + query.toString(), OPTS);
	}
	this.fetch = async (url, params) => {
		self.setContentType(mt.json); // set content type header
		const res = await fnFetch(url, params); // send call
		// avoid error when json response is null: (SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input)
		return res.ok ? res.json().catch(globalThis.void) : fnError(res); // return promise
	}
	this.msgs = (url, params) => self.fetch(url, params).then(fnMsgs)
	this.json = (url, params) => {
		alerts.loading(); // show loading indicator
		return self.msgs(url, params).finally(alerts.working);
	}

	this.text = async (url, params) => {
		alerts.loading(); // show loading indicator
		self.setContentType(mt.text); // set content type header
		const res = await fnFetch(url, params); // send call
		const promise = res.ok ? res.text() : fnError(res); // get promise
		return promise.finally(alerts.working); // Add default finally callback to promise
	}
	this.blob = async (url, filename) => {
		alerts.loading(); // show loading indicator
		const res = await globalThis.fetch(url, OPTS); // send call
		const objectURL = res.ok ? URL.createObjectURL(await res.blob()) : null;
		if (!objectURL) // object URL is required
			return fnError(res, "Invalid URL file.").finally(alerts.working);
		// if filename is not defined, try to get it from Content-Disposition header
		self.download(objectURL, filename || res.headers.get("Content-Disposition")?.split('"')[1]);
		URL.revokeObjectURL(objectURL); // revoke the object URL to free up memory at the end
		return Promise.resolve().finally(alerts.working); // return a resolve promise
	}

	this.send = async (url, params) => {
		alerts.loading(); // show loading indicator
		const res = await fnFetch(url, params); // send call
		if (!res.ok) // connection error
			return fnError(res).finally(alerts.working);
		const type = res.headers.get(HEADER_TYPE) || ""; // get response mime type
		return (type.includes(mt.json) ? res.json().then(fnMsgs) : res.text()).finally(alerts.working);
	}

	this.open = alerts.open; // open external resource
	this.showMsgs = alerts.showMsgs; // show server response
	this.html = data => { // open a new html tab
		const wnd = window.open("about:blank", "_blank");
		wnd.document.write(data); // parse all html
		wnd.document.close(); // end write
	}
	this.download = (objectURL, name) => {
		const link = document.createElement("a");
		link.href = objectURL; // set blob source
		link.download = name || "download.pdf"; // force file name
		link.click(); // download file to cliente
	}
}

export default new Api();
