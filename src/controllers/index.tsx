
import { ContextMsgs, Next } from "../types/hono";

import { admin } from "./admin";
import { Index, IndexTabs } from "../layouts/Index";
import { Maps, MapsTab0 } from "../layouts/Maps";
import { Email } from "../layouts/Email";

import sqlite from "../dao/sqlite/factory.js";
import menu from "../public/js/components/Menu.js";
import i18n from "../i18n/langs.js";

export const lang = (ctx: ContextMsgs, next: Next) => {
    const lang = ctx.req.param("lang");
    const session = ctx.get("session");
    if (lang != session.get("lang")) // has language changed?
        session.set("lang", i18n.getAcceptLanguage(lang/* + "," + ctx.req.header("Accept-Language")*/));
    return next();
}
export const init = (ctx: ContextMsgs, next: Next) => {
    const session = ctx.get("session");
    if (!session.get("lang"))
        session.set("lang", i18n.getAcceptLanguage(ctx.req.header("Accept-Language")));
    // Set ContextMsgs helpers
    const lang = session.get("lang"); // current lang
    ctx.getMsgs = () => i18n.resetValidators(lang);
    ctx.getValidators = () => i18n.createValidators(lang);
    ctx.xhr = () => (ctx.req.header("x-requested-with") == "XMLHttpRequest"); // Is AJAX call
    ctx.getLang = () => lang;
    return next();
}

export const index = (ctx: ContextMsgs) => {
    const msgs = ctx.getMsgs();
    return ctx.xhr() ? ctx.html(<IndexTabs msgs={msgs}/>) : ctx.html(<Index msgs={msgs}/>);
}

export const setLang = async (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    const user = session.get("user");
    if (!user)
        return ctx.html(<Index msgs={ctx.getMsgs()}/>);
    const lang = ctx.getLang();
    return await sqlite.menus.getMenus(user.id, lang).then((menus:any) => {
        session.set("menu", menu.html(menus));
        return admin(ctx);
    });
}

export const maps = (ctx: ContextMsgs) => {
    return ctx.xhr() ? ctx.html(<MapsTab0/>) : ctx.html(<Maps msgs={ctx.getMsgs()}/>);
}

export const test = (ctx: ContextMsgs) => {
    return ctx.text("Hello Word!");
}
export const email = (ctx: ContextMsgs) => {
    return ctx.html(<Email msgs={ctx.getMsgs()}/>);
}
