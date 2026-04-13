
import alerts from "./Alerts.js";
import coll from "./CollectionHTML.js";
import cv from "./cv/Resize.js";

function Tabs() {
	const self = this; //self instance
	const EVENTS = {}; //events tab container
	const ACTIVE_CLASS = "active";
	//const PROGRESS_BAR = "progress-bar";
	const tabs = document.getElementsByClassName("tab-content");
	let _tabIndex = -1; // no tab selected

	const fnSet = (name, fn) => { EVENTS[name] = fn; return self; }
	const fnActive = el => el.classList.contains(ACTIVE_CLASS); //active class
	const fnCurrentIndex = () => tabs.findIndex(fnActive); //current index tab
	const autofocus = tab => {
		const el = tab.$$("[tabindex]:not([type=hidden],[readonly],[disabled])").find(el => el.isVisible());
		el && el.focus();
		return self;
	}

    // Set and invoke events on tabs
    const _fire = (name, tab) => {
        const fn = tab && EVENTS[name + "-" + tab.id]; // get handler
        return fn ? fn(tab, self) : true; // if no event => true
    }

	this.getTabs = () => tabs; // tabs array
	this.getTab = id => tabs.findBy("#tab-" + id); // Find by id selector
	this.getCurrent = () => tabs[_tabIndex]; // current tab
	this.$1 = (tab, selector) => this.getTab(tab).$1(selector);
	this.$$ = (tab, selector) => this.getTab(tab).$$(selector);
	this.getAction = name => EVENTS[name]; // get event handler
	this.setAction = (name, fn) => fnSet(name, fn); // set event handler
	this.invoke = name => (self.getAction(name)()); // handler must exists
	this.setInitEvent = (tab, fn) => fnSet("init-tab-" + tab, fn);
	this.setViewEvent = (tab, fn) => fnSet("view-tab-" + tab, fn);
	this.setNextEvent = (tab, fn) => fnSet("next-tab-" + tab, fn);
	this.setBackEvent = (tab, fn) => fnSet("back-tab-" + tab, fn);
	//this.setExitEvent = (tab, fn) => fnSet("exit-tab-" + tab, fn);
	this.setActiveEvent = (tab, fn) => fnSet("active-tab-" + tab, fn);

	const _show = (tab, index) => {
		//_fire("exit", self.getCurrent()); // event to go back or ahead
		tabs.forEach(tab => tab.classList.remove(ACTIVE_CLASS));
		tab.classList.add(ACTIVE_CLASS); // active current tab only
		_tabIndex = index ?? fnCurrentIndex(); // current tab index
		if (!tab.dataset.loaded) { // event indicator
			_fire("init", tab); // Fire once when show tab
			tab.dataset.loaded = "1"; // avoid to fire event again
		}
		_fire("view", tab); // Fire when show tab
		cv.resize(tab); // resize iframe height
		//alerts.top(); // scroll to top
		return autofocus(tab);
	}
	const _goAgead = (tab, i) => {
		if (!_fire("next", self.getCurrent())) // validator before change
			return false; // validate event fails => not to go ahead
		tab.dataset.back = Math.max((_tabIndex < 0) ? (i - 1) : _tabIndex, 0);
		return _show(tab, i); // set current tab
	}
	const _goBack = (tab, i) => {
		const current = self.getCurrent(); // current tab before change
		// before go back => auto close all active/open toggle-links in current tab
		current.$$("a[href='#tab-toggle'][data-off='2']").forEach(self.toggle); // close all open links
		_fire("back", current); // fire back tab event
		return _show(tab, i); // set current tab
	}
	const _goTo = i => { // show tab by index
		i = ((i < 0) ? 0 : Math.min(i, tabs.length - 1)); // limit range
		if (_tabIndex == i) // is current tab
			return false; // no change tab
		const tab = tabs[i]; // get next tab
		if (_tabIndex < i) // go ahead in list tab
			return _fire("active", tab) ? _goAgead(tab, i) : _goTo(i + 1);
		// go back if current tab active else recursive search for prev active tab
		return _fire("active", tab) ? _goBack(tab, i) : _goTo(i - 1);
	}

	const _findIndex = id => tabs.findIndexBy("#tab-" + id); //find index tab by id
	const _nextIndex = id => (globalThis.isset(id) ? _findIndex(id) : (_tabIndex + 1)); //next index tab
	const _viewTab = i => { _goTo(i); return self; } // show tab by index and preserve alerts
	const _showTab = i => { _goTo(i) && alerts.closeAlerts(); return self; }; // show tab by index and close alerts

	this.view = id => _viewTab(_findIndex(id)); // find by id selector and preserve alerts
	this.show = id => _showTab(_findIndex(id)); // find by id selector and close alerts
	this.goTo = id => _viewTab(_nextIndex(id)); // find by id selector or next index tab and preserve alerts
	this.next = id => _showTab(_nextIndex(id)); // find by id selector or next index tab and close alerts
	this.back = id => _showTab(globalThis.isset(id) ? _findIndex(id) : +(tabs[_tabIndex].dataset.back ?? (_tabIndex - 1)));
	this.last = () => _showTab(tabs.length - 1);
	this.toggle = el => {
		if (!_fire("active-tab", el))
			return self; // inactive toggle
		if (!el.dataset.off)  { // is hide
			_fire("init-tab", el); // Fire once when open
			el.dataset.off = "1"; // avoid to call action again
		}
		if (el.dataset.off == "1") {
			_fire("view-tab", el); // Fire when show
			el.dataset.off = "2"; // avoid call action on close
		}
		else
			el.dataset.off = "1"; // allow call view action on open
		const icon = el.$1(el.dataset.icon || "i"); // icon indicator
		const fnToggle = el => { el.classList.toggle("hide") || autofocus(el); }; // toggle and set focus
		$$(el.dataset.target || (".info-" + el.id)).eachPrev(fnToggle);
		coll.split(el.dataset.toggle, " ").forEach(name => icon.toggle(name));
		self.setHeight(); // recalc height
		return self;
	}

	this.setActive = id => _show(self.getTab(id)); // Force active class whithot events and alerts
	this.isActive = id => fnActive(self.getTab(id)); // is current tab active
	this.setHeight = () => cv.setHeight(self.getCurrent()); // current tab height

	// if message is ok => go tab and preserve alerts after change
	this.showInit = () => self.view("init"); // show init view
	this.showForm = () => self.view("form"); // show form view
	this.showList = () => self.view("list"); // show list view
	this.showOk = msg => { alerts.showOk(msg || "saveOk"); return this; } // Encapsule showOk message
	this.showError = msg => { alerts.showError(msg); return this; } // Encapsule showError message
	this.setMsgs = alerts.setMsgs; // Encapsule setMsgs container

	this.load = el => { // set default actions
		el.querySelectorAll("[href^='#tab-']").setClick((ev, link) => {
			const href = link.getAttribute("href");
			const id = href.substring(href.lastIndexOf("-") + 1);
			if ((href == "#tab-back") || (href == "#tab-prev"))
				self.back();
			else if (href == "#tab-next")
				self.next();
			else if (href == "#tab-last")
				self.last();
			else if (href == "#tab-toggle")
				self.toggle(link); // call toggle handler
			else if (href.startsWith("#tab-action"))
				EVENTS[link.dataset.action || id](link); // call handler
			else
				self.show(id); // default action
			ev.preventDefault(); // no navigate
        });
        return self;
    }

	coll.ready(() => { // when dom is fully loaded
		_tabIndex = fnCurrentIndex(); // current index tab
		self.load(document); // set tab actions
	});
}

export default new Tabs();
