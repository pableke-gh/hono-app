
function Alerts() {
	const self = this; //self instance
	const ALERT_ACTIVE = "active";
	const ALERT_TEXT = "alert-text";
	const ALERT_CLOSE = "alert-close";

	const alerts = document.querySelector(".alerts"); // container
	const texts = alerts.getElementsByClassName(ALERT_TEXT);
    const icons = alerts.getElementsByClassName(ALERT_CLOSE);
	Array.from(icons).forEach(link => { link.onclick = ev => fnCloseParent(link); });  // Set close click event

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
	this.open = (url, err) => {
		if (url)  // open external resource
			return window.open(url, "_blank");
		self.showError(err || "errReport");
	}

	// Global handlers
    window.loading = self.loading;
    window.working = self.working;
}

export default new Alerts();
