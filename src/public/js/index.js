
import nav from "./components/Navigation.js";
import api from "./components/Api.js";
import dom from "./components/DomBox.js";
import menu from "./components/Menu.js";
import menus from "./data/menus.js";
import i18n from "./i18n/langs.js";

nav.ready(() => {
	const menuHTML = $1("ul.menu"); // menu UL HTML container
	const menuToggleBtn = menuHTML.parentNode.lastElementChild; // toggle phone menu (burger)
	const menuToggleIcon = menuToggleBtn.firstElementChild;
	menuToggleBtn.addEventListener("click", ev => {
		menuToggleIcon.toggle("fa-bars").toggle("fa-times");
		menuHTML.toggle("active"); // animate intro
	});

	const menuTree = menus.filter(node => (node.tipo == 1)).sort((a, b) => (a.orden - b.orden));
	menuHTML.innerHTML = /*menuHTML.innerHTML ||*/ menu.html(menuTree);
	const fnResize = () => {
		menuToggleIcon.classList.add("fa-bars");
		menuToggleIcon.classList.remove("fa-times");
		menuHTML.toggle("active", !dom.isMediaXs());
	}
	window.addEventListener("resize", fnResize);
	fnResize();

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    const themeToggleBtn = menuHTML.nextElementSibling;
    if (nav.isDarkMode()) // check current mode
        themeToggleBtn.lastElementChild.show(); // light icon
    else
        themeToggleBtn.firstElementChild.show(); // dark icon
    themeToggleBtn.addEventListener("click", function() {
        themeToggleBtn.children.toggle();  // toggle icons inside button
        nav.toggleMode(); // toggle mode light / dark
    });

	// Popover langs menu
	const langs = $1("[popovertarget='langs-menu']"); // Language button
    const link = langs.nextElementSibling.querySelector("a#" + i18n.get("lang")); // Language selector
    langs.firstElementChild.src = link.firstElementChild.src; // current flag
	langs.nextElementSibling.addEventListener("beforetoggle", ev => { //ev.newState == "open"/"closed"
		langs.lastElementChild.toggle("fa-chevron-down").toggle("fa-chevron-up");
	});

	// Load main tag via AJAX on click event
	$$("a.load-main").addClick((ev, link) => {
		api.init().text(link.href).then(nav.setMain);
		ev.preventDefault();
	});
});
