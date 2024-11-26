
//import sb from "./StringBox.js"
import alerts from "./Alerts.js";

function Api() {
	const self = this; //self instance
    const OPTS = {}; // Call options

    function fnError(err) {
        alerts.showError(err);
    }

    this.get = name => OPTS[name];
    this.set = (name, value) => { OPTS[name] = value; return self; }
    this.init = () => {
        Object.clear(OPTS); // remove previous options
        OPTS.headers = new Headers({ "x-requested-with": "XMLHttpRequest" }); // AJAX flag
        return self.set("cache", "default"); // Default options
    }

    this.getHeaders = () => OPTS.headers;
    this.getHeader = name => OPTS.headers.get(name);
    this.setHeader = (name, value) => { OPTS.headers.set(name, value); return self; }
    this.getToken = () => self.getHeader("x-access-token");// || sb.substring(headers["authorization"], 7);
    this.setToken = token => {
        //self.setHeader("authorization", "Bearer " + token);
        return self.setHeader("x-access-token", token);
    }

    this.setMethod = method => self.set("method", method);
    this.setBody = data => self.set("body", data);
    this.setText = data => self.setHeader("content-type", "plain/text").setBody(data);
    this.setJSON = data => self.setHeader("content-type", "application/json").setBody(JSON.stringify(data));

    this.text = async url => {
        alerts.loading(); // show loading indicator
        const res = await globalThis.fetch(url, OPTS); // send api call
        const promise = res.ok ? res.text() : Promise.reject(res.statusText);
        // Add default catch and finally functions to promise
        return promise.catch(fnError).finally(alerts.working);
    }
    this.json = async url => {
        alerts.loading(); // show loading indicator
        const res = await globalThis.fetch(url, OPTS); // send api call
        const promise = res.ok ? res.json() : Promise.reject(res.statusText);
        // Add default catch and finally functions to promise
        return promise.catch(fnError).finally(alerts.working);
    }

    this.send = async url => {
        alerts.loading(); // show loading indicator
        const res = await globalThis.fetch(url, OPTS); // send api call
        const type = res.headers.get("content-type") || ""; // get response mime type
        const data = await (type.includes("application/json") ? res.json() : res.text());
        const promise = res.ok ? Promise.resolve(data) : Promise.reject(data || res.statusText);
        return promise.finally(alerts.working);
    }

    this.sendText = (url, method, data) => self.init().setMethod(method).setText(data).send(url);
    this.sendJSON = (url, method, data) => self.init().setMethod(method).setJSON(data).send(url);
}

export default new Api();
