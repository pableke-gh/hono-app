
import alerts from "./Alerts.js";
import mt from "../data/mime-types.js";

function Api() {
	const self = this; //self instance
	const OPTS = {}; // Call options
	const HEADER_TYPE = "content-type"; // content-type key
	const HEADER_TOKEN = "x-access-token"; // Token key in header
	const HEADERS = new Headers({ "x-requested-with": "XMLHttpRequest" }); // AJAX header

	const fnMsgs = data => (alerts.showMsgs(data) ? data : Promise.reject(data));
	const fnError = msg => { // propaga el error por la cadena
		const error = msg || "Conection is not available.";
		alerts.showError(error); // show error on view
		return Promise.reject(error); // go next catch
	}

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
	this.setJSON = data => self.init().setPost().setContentType(mt.json).setBody(JSON.stringify(data));
	//this.setPdf = () => self.init().setPost().setContentType(mt.pdf); // pdf type
	//this.setZip = () => self.init().setPost().setContentType(mt.zip); // zip type
	//this.setBin = () => self.init().setPost().setContentType(mt.bin); // binary type

	/**
	 * @param {FormData} fd
	 * 
	 * Set form data. If the form contains file inputs, the FormData object will automatically set the correct multipart/form-data boundary in the request.
	 * Note: When using FormData, do not manually set the Content-Type header to multipart/form-data, as this can lead to issues with how the browser formats the request.
	 */
	this.setFormData = fd => self.init().setPost().setBody(fd); // set form data
	this.setForm = form => self.setFormData(new FormData(form)); // set data by form element

	const _response = (url, params) => {
		if (!params)
			return globalThis.fetch(url, OPTS); // send call
		const query = new URLSearchParams(params); // query params
		// then, catch and finally callbacks execute syncronously
		return globalThis.fetch(url + "?" + query.toString(), OPTS);
	}
	const _finally = promise => {
		alerts.loading(); // show loading indicator
		setTimeout(() => promise.finally(alerts.working).catch(globalThis.void), 1); // force last execution in promise chain
		return promise; // current chain promise
	}

	this.fetch = (url, params) => {
		const fnThen = res => (res.ok ? res.json() : Promise.reject(res.statusText));
		return _response(url, params).then(fnThen); // continue promise chaning
	}
	this.msgs = (url, params) => { // catch null json response => not error
		const fnThen = res => (res.ok ? res.json().catch(globalThis.void).then(fnMsgs) : fnError(res.statusText));
		return _response(url, params).then(fnThen); // continue promise chaning
	}
	this.json = (url, params) => {
		return _finally(self.msgs(url, params)); // get data from server
	}

	this.text = (url, params) => {
		const fnThen = res => (res.ok ? res.text() : fnError(res.statusText));
		return _finally(_response(url, params).then(fnThen));
	}

	this.blob = (url, filename) => { // binary file
		return _finally(globalThis.fetch(url, OPTS).then(async res => {
			if (!res.ok) return fnError(res.statusText);
			const blob = await res.blob(); // get binary
			const objectURL = blob && blob.size && URL.createObjectURL(blob);
			if (!objectURL) // object URL is required
				return fnError("Invalid URL file.");
			// if filename is not defined, try to get it from Content-Disposition header
			filename = filename || res.headers.get("Content-Disposition")?.split('"')[1];
			filename && self.download(objectURL, filename); // filename => direct download file
			// revoke the object URL to free up memory at the end of the end of promise chain
			setTimeout(() => URL.revokeObjectURL(objectURL), 1); // force last execution in chain
			return objectURL; // allow others actions over blob
		}));
	}

	this.send = (url, params) => {
		return _finally(_response(url, params).then(res => {
			if (!res.ok) return fnError(res.statusText);
			const type = res.headers.get(HEADER_TYPE) || ""; // get response mime type
			return (type.includes(mt.json) ? res.json().then(fnMsgs) : res.text());
		}));
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
