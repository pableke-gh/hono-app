
import { ContextMsgs } from "../types/hono";
import { Admin, Profile, ProfileActiveTab } from "../layouts/Admin";

import sqlite from "../dao/sqlite/factory.js";
import supabase from "../dao/supabase/factory.js";
import user from "app/model/web/User.js";
import util from "../lib/util.js";

export const admin = (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    return ctx.html(<Admin msgs={ctx.getMsgs()} user={session.get("user")} menu={session.get("menu")}/>);
}

export const welcome = async (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    const msgs = ctx.getMsgs().setOk("msgLoginOk");
    return ctx.html(<Admin msgs={msgs} user={session.get("user")} menu={session.get("menu")}/>);
}

export const viewProfile = async (ctx: ContextMsgs) => {
    const session = ctx.get("session");
    const user = session.get("user");
    return ctx.xhr() ? ctx.html(<ProfileActiveTab user={user}/>)
                    : ctx.html(<Profile msgs={ctx.getMsgs()} user={user} menu={session.get("menu")}/>);
}

export const saveProfile = async (ctx: ContextMsgs) => {
    const valid = ctx.getValidators();
    try {
        const body = await ctx.req.parseBody();
        if (user.validateProfile(body, valid).isError())
            return ctx.json(valid.getMsgs(), 500);
        const userSession = ctx.get("session").get("user");
        const fd = await ctx.req.formData(); // FormData object
        //const files = await util.uploadAll(user.id, fd.getAll("logo"));
        const file = await util.upload(userSession.id, fd.get("logo"));
        if (file) { // Optional file
            file.fk = 1;
            delete file.format;
            const results = await supabase.file.insert(file);
            if (results.error) // Insert row fails
                return util.unload(file.path).error(ctx, results.error);
            util.unload(userSession.logo);
            userSession.logo = file.path;
            await sqlite.usuarios.update(userSession);
        }
        return ctx.text("saveOk");
    } catch (err) {
        return util.error(ctx, err);
    }
}

export const deleteLogo = async (ctx: ContextMsgs) => {
    try {
        // TODO remove user logo
        return ctx.text("saveOk");
    } catch (err) {
        return util.error(ctx, err);
    }
}
