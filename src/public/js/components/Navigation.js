
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
	this.addClick = (el, selector) => {
		selector = selector || "a.load-main";
		el.querySelectorAll(selector).addClick((ev, link) => {
			api.init().text(link.href).then(self.setMain); // Load main via AJAX on click
			ev.preventDefault();
		});
		return self;
	}
	this.setMain = data => {
		if (!data) // exists changes
			return self; // Not changes

		main.innerHTML = data; // update contents
		main.querySelectorAll("script[id]").forEach(script => {
			const fn = self.getScript(script.id);
			if (fn) // Is function registered?
				return fn(); // Simule dispatch vt event
			import(script.src).then(module => {
				self.runScript(script.id, module.default);
			}).catch(err => {
				alerts.showError(err);
			});
			script.parentNode.removeChild(script);
		});

		alerts.top(); // Show top view
		tabs.load(main); // reload tabs events
		return self.addClick(main); // Listen new clicks
	}

	// Check to see if API is supported
	if (document.startViewTransition) {
		// capture navigation event links
		window.navigation.addEventListener("navigate", ev => {
			const url = new URL(ev.destination.url);
			//console.log(location.pathname, url, ev);
			if (url.searchParams.get("nav") || self.isDynamic(url.pathname))
				return; // Desactive View Transition interceptor
			// Current location, Important! AJAX NOT to change url
			if (location.pathname == url.pathname)
				return ev.preventDefault(); // Current destination
			// Si es una pagina externa => ignoramos el evento
			if (location.origin == url.origin) {
				// Navegación en el mismo dominio (origin)
				const RE_MAIN = /<main[^>]*>([\s\S]*)<\/main>/im;
				const fnTransition = text => {
					// Extraigo el contenido de la etiqueta main
					const fnLoad = () => self.setMain(text.match(RE_MAIN)[1]);
					// Utilizamos la api de View Transitions
					document.startViewTransition(fnLoad);
				}
				// Intercept event => Cargamos la pagina de destino con fetch
				const handler = () => api.init().text(url.href).then(fnTransition);
				ev.intercept({ handler }); // intercept event
			}
		});
	}

	// Init. theme mode light / dark
	coll.ready(self.setTheme);
}

export default new Navigation();
