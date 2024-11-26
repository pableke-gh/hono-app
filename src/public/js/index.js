
import nav from "./components/Navigation.js";
//import menu from "./components/Menu.js";
//import menus from "./data/menus.js";
import i18n from "./i18n/langs.js";

//const menuTree = menus.filter(node => (node.tipo == 1)).sort((a, b) => (a.orden - b.orden));

nav.ready(() => {
    const langs = document.getElementById("languages");
    const link = langs.querySelector("a#" + i18n.get("lang")); // Language selector
    langs.firstElementChild.firstElementChild.src = link.firstElementChild.src;

    const menuHTML = $1("ul.menu");
    //menuHTML.innerHTML = menuHTML.innerHTML || menu.html(menuTree);
    menuHTML.classList.add("active");

    // toggle phone menu
    const menuToggleBtn = $1(".menu-toggle");
    menuToggleBtn.addEventListener("click", ev => {
        menuToggleBtn.firstElementChild.toggle("fa-bars").toggle("fa-times");
        menuHTML.parentNode.toggle("active"); // animate intro
    });

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    const themeToggleBtn = $1("#theme-toggle");
    if (nav.isDarkMode()) // check current mode
        themeToggleBtn.lastElementChild.show(); // light icon
    else
        themeToggleBtn.firstElementChild.show(); // dark icon
    themeToggleBtn.addEventListener("click", function() {
        nav.toggleMode(); // toggle mode light / dark
        themeToggleBtn.children.toggle();  // toggle icons inside button
    });

    nav.addClick(document);
});
