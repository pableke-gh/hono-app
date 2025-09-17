
import alerts from "./Alerts.js";
import coll from "./CollectionHTML.js";

// Classes Configuration
const TAB_CLASS = "tab-content";
const ACTIVE_CLASS = "active";
//const PROGRESS_BAR = "progress-bar";

function Tabs() {
	const self = this; //self instance
	const EVENTS = {}; //events tab container

	// hack ifPage-frame styles for CV prod.
	const iframe = window.parent.document.querySelector("#ifPage-frame");
	let tabs, _tabIndex;

	const fnSet = (name, fn) => { EVENTS[name] = fn; return self; }
	const fnActive = el => el.classList.contains(ACTIVE_CLASS); //active class
	const fnFindIndex = id => tabs.findIndexBy("#tab-" + id); //find index tab by id
	const fnNextIndex = id => (globalThis.isset(id) ? fnFindIndex(id) : (_tabIndex + 1)); //next index tab
	const fnCurrentIndex = () => tabs.findIndex(fnActive); //current index tab
	const autofocus = tab => {
		const FOCUSABLED = "[tabindex]:not([type=hidden],[readonly],[disabled])";
		const el = tab.querySelectorAll(FOCUSABLED).find(el => el.isVisible());
		el && el.focus();
		return self;
	}

    // Set events on tabs actions
    const fnCallEvent = (name, tab) => {
        const fn = EVENTS[name + "-" + tab.id]; // get handler
        return fn ? fn(tab, self) : true; // if no event => true
    }

	this.setAction = (name, fn) => fnSet(name, fn);
	this.setShowEvent = (tab, fn) => fnSet("show-tab-" + tab, fn);
	this.setInitEvent = (tab, fn) => fnSet("init-tab-" + tab, fn);
	this.setViewEvent = (tab, fn) => fnSet("view-tab-" + tab, fn);
	this.setActiveEvent = (tab, fn) => fnSet("active-tab-" + tab, fn);
	this.invoke = name => EVENTS[name](); // action by name => must exists

	// Alerts helpers
	this.showOk = msg => { alerts.showOk(msg); return self; } // Encapsule showOk message
	this.showInfo = msg => { alerts.showInfo(msg); return self; } // Encapsule showInfo message
	this.showWarn = msg => { alerts.showWarn(msg); return self; } // Encapsule showWarn message
	this.showError = msg => { alerts.showError(msg); return self; } // Encapsule showError message
	this.showAlerts = alerts.showAlerts; // Encapsule showAlerts message

	const setHeight = tab => { // set iframe height
		iframe.style.height = Math.max(tab.scrollHeight + 80, 520) + "px";
	}
	const fnResize = tab => {
		if (!iframe)
			return alerts.top(); // scroll to top
		setHeight(tab); // auto-adapt iframe height on resize event
		iframe.setAttribute("scrolling", "no"); // disable scrollbars
		window.parent.scrollTo({ top: 0, behavior: "smooth" }); // parent to top
	}
	this.resize = () => { // resize current tab
		setHeight(self.getCurrent());
	}

	const fnGoTab = (tab, index) => {
		tabs.forEach(tab => tab.classList.remove(ACTIVE_CLASS));
		tab.classList.add(ACTIVE_CLASS); // active current tab only
		_tabIndex = index ?? fnCurrentIndex(); // current tab index
		if (!tab.dataset.loaded) { // event indicator
			fnCallEvent("init", tab); // Fire once when show tab
			tab.dataset.loaded = "1"; // avoid to fire event again
		}
		fnCallEvent("view", tab); // Fire when show tab
		fnResize(tab); // resize iframe if exists
		return autofocus(tab);
	}
	const fnGoAhead = (tab, i) => {
		tab.dataset.back = Math.max((_tabIndex < 0) ? (i - 1) : _tabIndex, 0);
		return fnGoTab(tab, i); // set current tab
	}
	const fnGoBack = (tab, i) => {
		// auto toggle off all links actions in current tab (before go back)
		self.getCurrent().querySelectorAll("a[href='#tab-toggle'][data-off]").forEach(self.toggle);
		return fnGoTab(tab, i); // set current tab
	}
	const fnMoveToTab = i => { // show tab by index
		i = ((i < 0) ? 0 : Math.min(i, tabs.length - 1)); // limit range
		if (_tabIndex == i) // is current tab
			return self.resize(); // no change
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

	this.viewTab = id => fnViewTab(fnFindIndex(id)); // find by id selector
	this.showTab = id => fnShowTab(fnFindIndex(id)); // find by id selector
	this.goTab = id => fnViewTab(fnNextIndex(id)); // find by id selector or next index tab
	this.nextTab = id => fnShowTab(fnNextIndex(id)); // find by id selector or next index tab
	this.backTab = id => fnShowTab(globalThis.isset(id) ? fnFindIndex(id) : +(tabs[_tabIndex].dataset.back ?? (_tabIndex - 1)));
	this.prevTab = self.backTab; // Synonym to go back to previous tab
	this.lastTab = () => fnShowTab(tabs.length - 1);

	this.getCurrent = () => tabs[_tabIndex]; // current tab
	this.getTab = id => tabs.findBy("#tab-" + id); // Find by id selector
	this.setActive = id => fnGoTab(self.getTab(id)); // Force active class whithot events and alerts
	this.isActive = id => fnActive(self.getTab(id)); // is current tab active
	this.toggle = el => {
		const fnAction = EVENTS[el.dataset.action]; // search handler
		if (fnAction && !el.dataset.off)  { // is hide
			el.dataset.off = "1"; // avoid to call action again
			fnAction(el); // call handler before show element
		}
		else
			delete el.dataset.off; // allow to call action again
		const icon = el.querySelector(el.dataset.icon || "i"); // icon indicator
		const fnToggle = el => { el.classList.toggle("hide") || autofocus(el); }; // toggle and set focus
		$$(el.dataset.target || (".info-" + el.id)).eachPrev(fnToggle);
		coll.split(el.dataset.toggle, " ").forEach(name => icon.toggle(name));
		return self;
	}

	// if message is ok => go tab and preserve alerts after change
	this.showInit = () => self.viewTab("init"); // show init view
	this.showForm = () => self.viewTab("form"); // show form view
	this.showList = () => self.viewTab("list"); // show list view

	this.setActions = el => { // set default actions
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
				self.showTab(id);
			ev.preventDefault(); // no navigate
        });
        return self;
    }
    this.load = el => {
        tabs = el.getElementsByClassName(TAB_CLASS);
        _tabIndex = fnCurrentIndex(); // current index tab
        return self.setActions(el); // update actions
    }

	// Init. view and PF navigation (only for CV-UAE)
	window.showTab = (xhr, status, args, tab) => (window.showAlerts(xhr, status, args) && self.goTab(tab));
	coll.ready(() => self.load(document)); // Load all tabs by default
}

export default new Tabs();
