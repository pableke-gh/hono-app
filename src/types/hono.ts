
import { Context } from "hono";
import Msgs from "../public/js/i18n/msgs.js";
import Validators from "../public/js/i18n/validators.js";

export declare class ContextMsgs extends Context {
    xhr: () => boolean;
    getLang: () => string;
    getMsgs: () => Msgs;
    getValidators: () => Validators;
}

export type Next = () => Promise<void>;
