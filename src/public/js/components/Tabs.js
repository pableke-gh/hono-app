
import alerts from "./Alerts.js";
import coll from "./CollectionHTML.js";

// Classes Configuration
const TAB_CLASS = "tab-content";
const ACTIVE_CLASS = "active";
//const PROGRESS_BAR = "progress-bar";
const fnTrue = () => true; // always true

function Tabs() {
	const self = this; //self instance
	const EVENTS = {}; //events tab container

	// hack ifPage-frame styles for CV
	const iframe = window.parent.document.querySelector("#ifPage-frame");

	let tabs, _tabIndex;

	const fnSet = (name, fn) => { EVENTS[name] = fn; return self; }
	const fnActive = el => el.classList.contains(ACTIVE_CLASS); //active class
	const fnFindIndex = id => tabs.findIndexBy("#tab-" + id); //find index tab by id
	const fnCurrentIndex = () => tabs.findIndex(fnActive); //current index tab
	const fnResize = tab => { iframe.style.height = ((tab?.scrollHeight || iframe.contentDocument.body) + 80) + "px"; }
	const autofocus = tab => {
		const FOCUSABLED = "[tabindex]:not([type=hidden],[readonly],[disabled])";
		const el = tab.querySelectorAll(FOCUSABLED).find(el => el.isVisible());
		el && el.focus();
		return self;
	}
	const fnSetTab = (tab, index) => { // update tabs style
		alerts.closeAlerts(); // Close all previous messages
		tabs.forEach(tab => tab.classList.remove(ACTIVE_CLASS));
		tab.classList.add(ACTIVE_CLASS); // active current tab only
		_tabIndex = index ?? fnCurrentIndex(); // current tab index
		if (!tab.dataset.loaded) { // event indicator
			fnCallEvent("init", tab); // Fire once when show tab
			tab.dataset.loaded = "1"; // avoid to fire event again
		}
		fnCallEvent("view", tab); // Fire when show tab
		if (iframe) {
			fnResize(tab); // resize iframe height
			window.parent.scrollTo({ top: 0, behavior: "smooth" });
		}
		return autofocus(tab);
	}

    this.getCurrent = () => tabs[_tabIndex]; // current tab
    this.getTab = id => tabs.findBy("#tab-" + id); // Find by id selector
    this.setActive = id => fnSetTab(self.getTab(id)); // Force active class whithot events and alerts
    this.isActive = id => fnActive(self.getTab(id)); // is current tab active

    // Set events on tabs actions
    const fnCallEvent = (name, tab) => {
        const fn = EVENTS[name + "-" + tab.id] || fnTrue;
        return fn(tab, self);
    }

	this.setAction = (name, fn) => fnSet(name, fn);
	this.setShowEvent = (tab, fn) => fnSet("show-tab-" + tab, fn);
	this.setInitEvent = (tab, fn) => fnSet("init-tab-" + tab, fn);
	this.setViewEvent = (tab, fn) => fnSet("view-tab-" + tab, fn);
	this.setActiveEvent = (tab, fn) => fnSet("active-tab-" + tab, fn);

	// Alerts helpers
	this.showOk = msg => { alerts.showOk(msg); return self; } // Encapsule showOk message
	this.showInfo = msg => { alerts.showInfo(msg); return self; } // Encapsule showInfo message
	this.showWarn = msg => { alerts.showWarn(msg); return self; } // Encapsule showWarn message
	this.showError = msg => { alerts.showError(msg); return self; } // Encapsule showError message
	this.showAlerts = data => { alerts.showAlerts(data); return self; } // Encapsule showAlerts message

	function fnShowTab(i) { //show tab by index
        i = (i < 0) ? 0 : Math.min(i, tabs.length - 1);
        const tab = tabs[i]; // get next tab
        if (_tabIndex < i) { // go ahead
			if (!fnCallEvent("active", tab)) // is current tab active
                return fnShowTab(i + 1); // recursive search for next active tab
            if (fnCallEvent("show", tab)) { // Validate event before change tab
                tab.dataset.back = Math.max((_tabIndex < 0) ? (i - 1) : _tabIndex, 0);
                fnSetTab(tab, i); // set current tab
            }
        }
        else { // go back
			if (!fnCallEvent("active", tab)) // is current tab active
				return fnShowTab(i - 1); // recursive search for prev active tab
			const currentTab = self.getCurrent();
			if (currentTab) { // auto toggle off links actions
				const toggleOff = "a[href='#tab-toggle'][data-off]";
				currentTab.querySelectorAll(toggleOff).forEach(self.toggle);
			}
			fnSetTab(tab, i); // set current tab
        }
        return self;
    }

	this.showTab = id => fnShowTab(fnFindIndex(id)); //find by id selector
	this.nextTab = id => fnShowTab(globalThis.isset(id) ? fnFindIndex(id) : (_tabIndex + 1));
	this.backTab = id => fnShowTab(globalThis.isset(id) ? fnFindIndex(id) : +(tabs[_tabIndex].dataset.back ?? (_tabIndex - 1)));
	this.prevTab = self.backTab; // Synonym to go back to previous tab
	this.lastTab = () => fnShowTab(tabs.length - 1);
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
    this.showMsgs = (msgs, tab) => {
        const ok = !msgs?.msgError; // is error message
        if (ok) // If message is ok => Show next tab
            globalThis.isset(tab) ? self.showTab(tab) : self.nextTab();
        alerts.showAlerts(msgs); // Always show alerts after change tab
        return ok;
    }

	this.setActions = el => { // set default actions
        el.querySelectorAll("[href^='#tab-']").forEach(link => {
            link.onclick = ev => {
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
            }
        });
        return self;
    }
    this.load = el => {
        tabs = el.getElementsByClassName(TAB_CLASS);
        _tabIndex = fnCurrentIndex(); // current index tab
        return self.setActions(el); // update actions
    }

	// Init. view and PF navigation (only for CV-UAE)
	window.showTab = (xhr, status, args, tab) => (alerts.isLoaded(xhr, status, args) && self.showMsgs(coll.parse(args.msgs), tab));
	coll.ready(() => {
		if (iframe) { // auto-adapt iframe height on resize event
			const ro = new ResizeObserver(() => fnResize(self.getCurrent()));
			ro.observe(iframe.contentDocument.body);
			iframe.setAttribute("scrolling", "no");
		}
		self.load(document); // Load all tabs by default
	});
}

export default new Tabs();
