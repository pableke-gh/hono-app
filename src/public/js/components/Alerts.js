
import coll from "./CollectionHTML.js";
import stream from "./Stream.js";

// Classes Configuration
const ALERT_ACTIVE = "active";
const ALERT_TEXT = "alert-text";
const ALERT_CLOSE = "alert-close";

function Alerts() {
	const self = this; //self instance
    const alerts = $1(".alerts"); // container
    const texts = alerts.getElementsByClassName(ALERT_TEXT);
    const close = alerts.getElementsByClassName(ALERT_CLOSE);

	// Handle loading div
    const _loading = alerts.nextElementSibling; // loading animation = none
	this.loading = () => { _loading.classList.add(ALERT_ACTIVE); return self.closeAlerts(); }
	this.working = () => { _loading.classList.remove(ALERT_ACTIVE); return self; } // working animation = fadeOut

    // Scroll body to top on click and toggle back-to-top arrow
	const _top = _loading.nextElementSibling;
    this.top = () => { window.scrollTo({ top: 0, behavior: "smooth" }); }
	_top.addEventListener("click", ev => { self.top(); ev.preventDefault(); });
	window.onscroll = function() { _top.setVisible(this.scrollY > 80); }

    const fnShow = (alert, txt) => {
        alert.classList.add(ALERT_ACTIVE);
        alert.children[1].setMsg(txt); // text
        return self;
    }
    const fnClose = alert => alert.classList.remove(ALERT_ACTIVE);
    const fnCloseParent = el => fnClose(el.parentNode);
    const setAlert = (alert, txt) => {
        if (txt) { // Message exists
            alert.eachSibling(fnClose); // close previous alerts
            return fnShow(alert, txt); // show specific alert typw
        }
        return self;
    }

    this.showOk = msg => setAlert(alerts.children[0], msg); //green
    this.showInfo = msg => setAlert(alerts.children[1], msg); //blue
    this.showWarn = msg => setAlert(alerts.children[2], msg); //yellow
    this.showError = msg => setAlert(alerts.children[3], msg); //red
    this.showAlerts = function(msgs) {
        if (msgs) { //show posible multiple messages types
            msgs.msgOk && fnShow(alerts.children[0], msgs.msgOk);
            msgs.msgInfo && fnShow(alerts.children[1], msgs.msgInfo);
            msgs.msgWarn && fnShow(alerts.children[2], msgs.msgWarn);
            msgs.msgError && fnShow(alerts.children[3], msgs.msgError);
        }
        return self.working();
    }

    this.closeAlerts = function() {
        texts.forEach(fnCloseParent); // fadeOut all alerts
        return self;
    }

    close.forEach(el => el.addEventListener("click", ev => fnCloseParent(el))); // Add close click event
    const fnAlerts = () => texts.forEach(el => { el.innerHTML && fnShow(el.parentNode, el.innerHTML); }); // Alerts with contents
    coll.ready(() => setTimeout(fnAlerts, 1)); // Show posible server messages after DOMContentLoaded event

    // Global handlers
    window.loading = self.loading;
    window.working = self.working;

	window.catchError = promise => {
		self.loading(); // redefine global catchError with loading / working
		return promise.then(data => [undefined, data]).catch(err => [err]).finally(self.working);
	}
	window.catchPromise = fn => window.catchError(new Promise(fn));
	
    this.isLoaded = function(xhr, status, args) { // PF server error xhr
        if (xhr && (status == "success"))
            return true; // status 200
        var msg = "Error 500: Internal server error."; // default
        msg = (globalThis.isstr(xhr) && (xhr.length < 100)) ? xhr : msg;
        msg = (xhr && xhr.statusText) ? xhr.statusText : msg;
        return !self.showError(msg).working(); // show error
    }
    window.showAlerts = (xhr, status, args) => {
        if (!self.isLoaded(xhr, status, args))
            return false; // Server error
        const msgs = coll.parse(args?.msgs);
        self.showAlerts(msgs); // show all messages
        return !msgs?.msgError; // has error message
    }

	window.openUrl = (xhr, status, args, name) => { window.showAlerts(xhr, status, args) && stream.redir(args?.url, name || args.name); }
	window.openHtml = (xhr, status, args, title) => { window.showAlerts(xhr, status, args) && stream.html(args.data, title || args.title); }
	window.openZip = (xhr, status, args, name) => { window.showAlerts(xhr, status, args) && stream.zip(args.data, name || args.name); }
	//window.openBlob = (xhr, status, args, type) => { window.showAlerts(xhr, status, args) && stream.blob(args.data, type); }
	window.openPdf = (xhr, status, args) => { window.showAlerts(xhr, status, args) && stream.pdf(args.data); }
}

export default new Alerts();
