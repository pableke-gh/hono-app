
import { raw } from "hono/html";
import i18n from "../i18n/langs";
import menu from "../public/js/components/Menu.js";
import sqlite from "../dao/sqlite/factory.js";

// Top level async
i18n.setLang("es").set("menu", menu.html(await sqlite.menus.getPublic("es")));
i18n.setLang("en").set("menu", menu.html(await sqlite.menus.getPublic("en")));

export default (props: any) => {
    const menus = props.children || i18n.get("menu");
    return ( <ul class="menu hide">{raw(menus)}</ul> );
}
