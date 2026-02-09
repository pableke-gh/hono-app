
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
	const fnFindIndex = id => tabs.findIndexBy("#tab-" + id); //find index tab by id
	const fnNextIndex = id => (globalThis.isset(id) ? fnFindIndex(id) : (_tabIndex + 1)); //next index tab
	const fnCurrentIndex = () => tabs.findIndex(fnActive); //current index tab
	const autofocus = tab => {
		const el = tab.$$("[tabindex]:not([type=hidden],[readonly],[disabled])").find(el => el.isVisible());
		el && el.focus();
		return self;
	}

    // Set events on tabs actions
    const fnCallEvent = (name, tab) => {
        const fn = EVENTS[name + "-" + tab.id]; // get handler
        return fn ? fn(tab, self) : true; // if no event => true
    }

	this.getTabs = () => tabs; // tabs array
	this.getAction = name => EVENTS[name]; // get event handler
	this.setAction = (name, fn) => fnSet(name, fn); // set event handler
	this.invoke = name => (self.getAction(name)()); // handler must exists
	this.setShowEvent = (tab, fn) => fnSet("show-tab-" + tab, fn);
	this.setInitEvent = (tab, fn) => fnSet("init-tab-" + tab, fn);
	this.setViewEvent = (tab, fn) => fnSet("view-tab-" + tab, fn);
	this.setActiveEvent = (tab, fn) => fnSet("active-tab-" + tab, fn);

	const fnGoTab = (tab, index) => {
		tabs.forEach(tab => tab.classList.remove(ACTIVE_CLASS));
		tab.classList.add(ACTIVE_CLASS); // active current tab only
		_tabIndex = index ?? fnCurrentIndex(); // current tab index
		if (!tab.dataset.loaded) { // event indicator
			fnCallEvent("init", tab); // Fire once when show tab
			tab.dataset.loaded = "1"; // avoid to fire event again
		}
		fnCallEvent("view", tab); // Fire when show tab
		cv.resize(tab); // resize iframe height
		//alerts.top(); // scroll to top
		return autofocus(tab);
	}
	const fnGoAhead = (tab, i) => {
		tab.dataset.back = Math.max((_tabIndex < 0) ? (i - 1) : _tabIndex, 0);
		return fnGoTab(tab, i); // set current tab
	}
	const fnGoBack = (tab, i) => {
		// auto toggle off all active toggle-links in current tab (before go back)
		self.getCurrent().$$("a[href='#tab-toggle'][data-off='2']").forEach(self.toggle);
		return fnGoTab(tab, i); // set current tab
	}
	const fnMoveToTab = i => { // show tab by index
		i = ((i < 0) ? 0 : Math.min(i, tabs.length - 1)); // limit range
		if (_tabIndex == i) // is current tab
			return false; // no change tab
		const tab = tabs[i]; // get next tab
		if (_tabIndex < i) { // go ahead
			if (fnCallEvent("active", tab)) // if tab active => fire validate event
				return fnCallEvent("show", tab) && fnGoAhead(tab, i); // validator before change
			return fnMoveToTab(i + 1); // recursive search for next active tab
		}
		// go back if current tab active else recursive search for prev active tab
		return fnCallEvent("active", tab) ? fnGoBack(tab, i) : fnMoveToTab(i - 1);
	}
	const fnViewTab = i => { fnMoveToTab(i); return self; } // show tab by index and preserve alerts
	const fnShowTab = i => { fnMoveToTab(i) && alerts.closeAlerts(); return self; }; // show tab by index and close alerts

	this.viewTab = id => fnViewTab(fnFindIndex(id)); // find by id selector and preserve alerts
	this.showTab = id => fnShowTab(fnFindIndex(id)); // find by id selector and close alerts
	this.goTab = id => fnViewTab(fnNextIndex(id)); // find by id selector or next index tab
	this.nextTab = id => fnShowTab(fnNextIndex(id)); // find by id selector or next index tab
	this.backTab = id => fnShowTab(globalThis.isset(id) ? fnFindIndex(id) : +(tabs[_tabIndex].dataset.back ?? (_tabIndex - 1)));
	this.prevTab = self.backTab; // Synonym to go back to previous tab
	this.lastTab = () => fnShowTab(tabs.length - 1);
	this.toggle = el => {
		if (!fnCallEvent("active-tab", el))
			return self; // inactive toggle
		if (!el.dataset.off)  { // is hide
			fnCallEvent("init-tab", el); // Fire once when open
			el.dataset.off = "1"; // avoid to call action again
		}
		if (el.dataset.off == "1") {
			fnCallEvent("view-tab", el); // Fire when show
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

	this.getCurrent = () => tabs[_tabIndex]; // current tab
	this.getTab = id => tabs.findBy("#tab-" + id); // Find by id selector
	this.setActive = id => fnGoTab(self.getTab(id)); // Force active class whithot events and alerts
	this.isActive = id => fnActive(self.getTab(id)); // is current tab active
	this.setHeight = () => cv.setHeight(self.getCurrent()); // current tab height
	this.reset = ids => {
		const temp = ids ? ids.map(self.getTab) : tabs; // get tabs array
		temp.forEach(tab => { delete tab.dataset.loaded; }); // reset loaded events
		return self;
	}

	// if message is ok => go tab and preserve alerts after change
	this.showInit = () => self.viewTab("init"); // show init view
	this.showForm = () => self.viewTab("form"); // show form view
	this.showList = () => self.viewTab("list"); // show list view
	this.showOk = msg => { alerts.showOk(msg); return this; } // Encapsule showOk message
	this.showError = msg => { alerts.showError(msg); return this; } // Encapsule showError message
	this.setMsgs = alerts.setMsgs; // Encapsule setMsgs container

	this.load = el => { // set default actions
		el.querySelectorAll("[href^='#tab-']").setClick((ev, link) => {
			const href = link.getAttribute("href");
			const id = href.substring(href.lastIndexOf("-") + 1);
			if ((href == "#tab-back") || (href == "#tab-prev"))
				self.backTab();
			else if (href == "#tab-next")
				self.nextTab();
			else if (href == "#tab-last")
				self.lastTab();
			else if (href == "#tab-toggle")
				self.toggle(link); // call toggle handler
			else if (href.startsWith("#tab-action"))
				EVENTS[link.dataset.action || id](link); // call handler
			else
				self.showTab(id); // default action
			ev.preventDefault(); // no navigate
        });
        return self;
    }

	// Init. view and PF navigation (only for CV-UAE)
	window.showTab = (xhr, status, args, tab) => (window.showAlerts(xhr, status, args) && self.goTab(tab));
	coll.ready(() => { // when dom is fully loaded
		_tabIndex = fnCurrentIndex(); // current index tab
		self.load(document); // set tab actions
	});
}

export default new Tabs();
