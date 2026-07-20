
import msgs from "./MsgContainer.js";
import Message from "./Message.js";

customElements.define("msg-flat", Message, { extends: "p" });

export default msgs;
