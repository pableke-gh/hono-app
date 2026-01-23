
import coll from "./CollectionHTML.js";

function Alerts() {
	const self = this; //self instance
	const ALERT_ACTIVE = "active";
	const ALERT_TEXT = "alert-text";
	const ALERT_CLOSE = "alert-close";

	const alerts = $1(".alerts"); // container
	const texts = alerts.getElementsByClassName(ALERT_TEXT);

	// Handle loading div
	const _loading = alerts.nextElementSibling; // loading animation = none
	this.loading = () => { _loading.classList.add(ALERT_ACTIVE); return self.closeAlerts(); }
	this.working = () => { _loading.classList.remove(ALERT_ACTIVE); return self; } // working animation = fadeOut

	// Scroll body to top on click and toggle back-to-top arrow
	const _top = _loading.nextElementSibling;
	this.top = () => window.scrollTo({ top: 0, behavior: "smooth" });
	_top.addEventListener("click", ev => { self.top(); ev.preventDefault(); });
	window.onscroll = function() { _top.setVisible(this.scrollY > 80); }

	const fnShow = (alert, txt) => {
		alert.classList.add(ALERT_ACTIVE); // show alert
		alert.children[1].setMsg(txt); // set text
		return self;
	}
	const fnSetText = (alert, txt) => (txt && fnShow(alert, txt)); // show alert only if text exists
	const fnClose = alert => alert.classList.remove(ALERT_ACTIVE); // close alert element
	const fnCloseParent = el => fnClose(el.parentNode);
	const fnSetAlert = (alert, txt) => {
		if (!txt) return self; // no message to show
		alert.eachSibling(fnClose); // close previous alerts
		return fnShow(alert, txt); // show specific alert typw
	}

	this.showOk = msg => fnSetAlert(alerts.children[0], msg); //green
	this.showInfo = msg => fnSetAlert(alerts.children[1], msg); //blue
	this.showWarn = msg => fnSetAlert(alerts.children[2], msg); //yellow
	this.showError = msg => fnSetAlert(alerts.children[3], msg); //red
	this.setMsgs = msgs => {
		if (!globalThis.isObject(msgs)) // msgs container
			return true; // no messages => ok
		// show multiple messages types (ok, info...)
		fnSetText(alerts.children[0], msgs.msgOk);
		fnSetText(alerts.children[1], msgs.msgInfo);
		fnSetText(alerts.children[2], msgs.msgWarn);
		return !fnSetText(alerts.children[3], msgs.msgError); // error message
    }

	this.showMsgs = data => self.setMsgs(data?.msgs || data); // msgs container
	this.showAlerts = data => self.working().showMsgs(data); // hide loading frame and show msgs container
	this.closeAlerts = () => { texts.forEach(fnCloseParent); return self; } // fadeOut all alerts
    alerts.getElementsByClassName(ALERT_CLOSE).setClick((ev, link) => fnCloseParent(link)); // Set close click event

    // Global handlers
    window.loading = self.loading;
    window.working = self.working;

	/*window.catchError = promise => {
		self.loading(); // redefine global catchError with loading / working
		return promise.then(data => [undefined, data]).catch(err => [err]).finally(self.working);
	}
	window.catchPromise = async fn => await window.catchError(new Promise(fn));*/

	window.showAlerts = (xhr, status, args) => { // PF hack => show all messages
		if (xhr && (status == "success")) // is PF server error xhr?
			return self.showAlerts(coll.parse(args.msgs)); // status 200
		var msg = "Error 500: Internal server error."; // default
		msg = (globalThis.isstr(xhr) && (xhr.length < 100)) ? xhr : msg;
		msg = (xhr && xhr.statusText) ? xhr.statusText : msg;
		return !self.showError(msg).working(); // show error
	}
	this.open = (url, err) => { url ? window.open(url, "_blank") : self.showError(err || "errReport"); } // open external resource
	//window.openUrl = (xhr, status, args) => { window.showAlerts(xhr, status, args) && self.open(args?.url); } // PF open url hack
}

export default new Alerts();
