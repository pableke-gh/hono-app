
import api from "./Api.js";
import alerts from "./Alerts.js";
import coll from "./CollectionHTML.js";
import tabs from "./Tabs.js";

function Navigation() {
	const self = this; // self instance
	const SCRIPTS = {}; // function container
	const KEY_THEME = "color-theme"; // Key to store theme mode
	const main = document.body.children.findBy("main");

	this.ready = coll.ready; // synonym
	this.isStatic = pathname => pathname.endsWith(".html");
	this.isDynamic = pathname => !self.isStatic(pathname);
	this.redirect = pathname => { window.location.href = pathname; }

	this.setTheme = () => self.isDarkMode() ? self.setDarkMode() : self.setLightMode();
	this.toggleMode = () => self.isDarkMode() ? self.setLightMode() : self.setDarkMode();
	this.isDarkMode = () => ((localStorage.getItem(KEY_THEME) === "dark") || (!(KEY_THEME in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches));
	this.setDarkMode = () => {
		document.documentElement.classList.add("dark");
		localStorage.setItem(KEY_THEME, "dark");
		return self;
	}
	this.isLightMode = () => !self.isDarkMode();
	this.setLightMode = () => {
		document.documentElement.classList.remove("dark");
		localStorage.setItem(KEY_THEME, "light");
		return self;
    }

	this.getScript = name => SCRIPTS[name];
	this.setScript = (name, fn) => { SCRIPTS[name] = fn; return self; } // save script
	this.runScript = (name, fn) => { fn(); return self.setScript(name, fn); } // Execute and save handler

	// Capture clicks events to load main via AJAX
	/*this.addClick = (el, selector) => {
		selector = selector || "a.load-main";
		el.querySelectorAll(selector).addClick((ev, link) => {
			api.init().text(link.href).then(self.setMain); // Load main via AJAX on click
			ev.preventDefault();
		});
		return self;
	}*/
	this.setMain = data => {
		if (!data) // exists changes
			return self; // Not changes

		main.innerHTML = data; // update contents
		main.querySelectorAll("script[id]").forEach(script => {
			const fn = self.getScript(script.id);
			script.parentNode.removeChild(script);
			if (fn) // Is function registered?
				return fn(); // Simule dispatch vt event

			// dynamic import
			import(script.src).then(module => {
				self.runScript(script.id, module.default);
			}).catch(err => {
				alerts.showError(err);
			});
		});

		alerts.top(); // go to top view
		tabs.load(main); // reload tabs events
		return self;
	}

	// Check to see if API is supported
	const RE_MAIN = /<main[^>]*>([\s\S]*)<\/main>/im;
	let pathname = location.pathname; // current location
	// capture all navigation event links
	window.navigation.addEventListener("navigate", ev => {
		const url = new URL(ev.destination.url);
		//console.log(location.pathname, url, ev);
		if (url.searchParams.get("nav") || self.isDynamic(url.pathname))
			return; // Desactive View Transition interceptor
		// Is current location? Important! AJAX NOT to change url
		if (pathname == url.pathname)
			return ev.preventDefault(); // Current destination
		// Si es una pagina externa => ignoramos el evento
		if (location.origin == url.origin) { // Navegación en el mismo dominio (origin)
			api.init().text(url.href).then(text => self.setMain(text.match(RE_MAIN)[1]));
			pathname = url.pathname; // save current location
			ev.preventDefault(); // avoid navigation
		}
	});

	// Init. theme mode light / dark
	coll.ready(self.setTheme);
}

export default new Navigation();
