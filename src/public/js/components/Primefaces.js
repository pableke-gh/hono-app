
import alerts from "./Alerts.js";
import coll from "./CollectionHTML.js";

function param(name, value) {
    return [{ name, value }];
}
function params(data) {
    const params = []; // container
    for (const name in data) // Object to params
        params.push({ name, value: data[name] });
    return params;
}
// p:remoteCommand server call
function send(action, params) {
    alerts.loading(); // Show loading frame
    const fnCall = window[action];
    fnCall(params); // call server
}
function sendId(action, id) { send(action, param("id", id)); }
function sendTerm(action, term) { send(action, param("term", term)); }
function sendIndex(action, index) { send(action, param("i", index)); }
function fetch(action, data) { send(action, params(data)); }

function datalist(form, select, input, opts) {
    opts = opts || {}; // Init. options
    const fnChange = opts.onChange || globalThis.void; // fired on load event
    const fnReset = opts.onReset || globalThis.void; // fired on reset event

    input = form.getInput(input); // get input element
    opts.onChange = item => { // fired on load event
        input.value = item.value ?? item; // item object or simple string
        fnChange(item);
    }
    opts.onReset = () => { // fired on reset event
        input.value = "";
        fnReset();
    };
    return form.setDatalist(select, opts);
}

function uploads(list, fn) {
	list.setClick(ev => {
        const parent = ev.target.parentNode;
        const file = parent.querySelector("[type='file']");
		file.onchange = ev => {
			const el = parent.querySelector(".filename");
            if (el) // Element to show file name
                el.innerHTML = ev.target.files[0]?.name || "";
            fn && fn(ev.target); // callback onchange input file
        }
		file.click();
	});
}

export default {
    param, params, 
    send, sendId, sendTerm, sendIndex, fetch,
    ready: coll.ready, isLoaded: alerts.isLoaded, showAlerts: window.showAlerts,
    datalist, uploads
}
