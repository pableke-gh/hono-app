
import { ContextMsgs } from "../types/hono";
import { Error404, Error500 } from "../layouts/Errors";

export const error404 = (ctx: ContextMsgs) => {
    const msg = "Error 404: Resource not found";
    if (ctx.xhr())
        return ctx.text(msg, 404); // AJAX call
    const msgs = ctx.getMsgs().setError(msg);
    return ctx.html(<Error404 msgs={msgs}/>);
}

export const error500 = (err: Error, ctx: ContextMsgs) => {
    console.error(err); // log error
    if (ctx.xhr())
        return ctx.text("" + err, 500); // AJAX call
    const msgs = ctx.getMsgs().setError("" + err);
    return ctx.html(<Error500 msgs={msgs}/>);
}
