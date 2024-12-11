
import nav from "./components/Navigation.js";
import menu from "./components/Menu.js";
import menus from "./data/menus.js";
import i18n from "./i18n/langs.js";

nav.ready(() => {
   // toggle phone menu (media sx)
   const menuToggleBtn = $1(".menu-toggle");
   const menuToggleIcon = menuToggleBtn.firstElementChild;
   menuToggleBtn.addEventListener("click", ev => {
	   menuHTML.toggle("active"); // animate intro
	   menuToggleIcon.toggle("fa-bars").toggle("fa-times");
   });

	const menuHTML = $1("ul.menu");
	const menuTree = menus.filter(node => (node.tipo == 1)).sort((a, b) => (a.orden - b.orden));
	menuHTML.innerHTML = /*menuHTML.innerHTML ||*/ menu.html(menuTree);
	const fnResize = () => {
		menuToggleIcon.classList.add("fa-bars");
		menuToggleIcon.classList.remove("fa-times");
		menuHTML.toggle("active", window.screen.width > 575);
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

    nav.addClick(document);
});
