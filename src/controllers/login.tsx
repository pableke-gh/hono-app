
import { ContextMsgs, Next } from "../types/hono";
import { getCookie, setCookie } from "hono/cookie";
import { Login, LoginActiveTab } from "../layouts/Login";

import sqlite from "../dao/sqlite/factory.js";
import menu from "app/js/components/Menu.js";
import user from "app/model/web/User.js";
import util from "../lib/util.js";

function logged(ctx: ContextMsgs) {
    return ctx.xhr() ? ctx.text("login ok!") : ctx.html(<LoginActiveTab/>);
}
function logerr(err: string, ctx: ContextMsgs) {
    if (ctx.xhr()) // AJAX error
        return ctx.text(err, 500);
    if ("GET" == ctx.req.method) // Session helper
        ctx.get("session").set("url", ctx.req.url);
    const msgs = ctx.getMsgs().setError(err);
    return ctx.html(<Login msgs={msgs}/>); // Go error
}

// Check if user is logged
export const auth = (ctx: ContextMsgs, next: Next) => {
    const session = ctx.get("session");
    if (!session.get("user"))
        return logerr("msgAuthFail", ctx);
    if (!session.sessionValid())
        return logerr("msgExpired", ctx);
    return next();
}
export const login = (ctx: ContextMsgs) => {
    const msgs = ctx.getMsgs();
    return ctx.xhr() ? ctx.html(<LoginActiveTab msgs={msgs}/>) : ctx.html(<Login msgs={msgs}/>);
}
export const signin = async (ctx: ContextMsgs) => {
    const valid = ctx.getValidators();
    const session = ctx.get("session");
    return await ctx.req.parseBody().then(body => {
        if (user.validateLogin(body, valid).isError())
            throw new Error("msgAuthFail");
        return sqlite.usuarios.login(body.login, body.pass);
    }).then(user => {
        session.set("user", user);
        return sqlite.menus.getMenus(user.id, ctx.getLang());
    }).then(menus => {
        session.set("menu", menu.html(menus)); // Specific menus
        return ctx.text(session.get("url") || "/admin/welcome"); // Session redirect
    }).catch(err => {
        return ctx.json(valid.setException(err).getMsgs(), 500);
    });
}
export const logout = (ctx: ContextMsgs) => {
    const session = ctx.get("session"); // User session
    session.deleteSession(); // Remove currrent session
    session.set("lang", ctx.getLang()); // save current lang
    const msgs = ctx.getMsgs().setOk("msgLogout");
    return ctx.html(<Login msgs={msgs}/>); // Go login view
}

export const sign = async (ctx: ContextMsgs) => {
    return await ctx.req.parseBody().then(body => {
        return sqlite.usuarios.login(body.login, body.pass);
    }).then(user => {
        setCookie(ctx, "token", util.sign({ id: user.id }));
        //ctx.get("session").set("user", user);
        return logged(ctx);
    }).catch(err => {
        return logerr("" + err, ctx);
    });
}
export const verify = async (ctx: ContextMsgs, next: Next) => {
    const token = getCookie(ctx, "token");
    return await util.verify(token).then(user => next())
                    .catch(err => logerr("" + err, ctx));
}
