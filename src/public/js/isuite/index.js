
import FileBanck from "./components/FileBanck.js";
import Recibos from "./modules/recibos.js";
import form from "./modules/isuite.js";

//coll.ready(() => {});

customElements.define("file-banck", FileBanck, { extends: "input" });
customElements.define("recibos-form", Recibos, { extends: "form" });
