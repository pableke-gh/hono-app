
import acordeones from "../../../core/components/accordions/container.js";
import TpvAccordion from "./Tpv.js";
import Norma43Accordion from "./Norma43.js";
import Norma57Accordion from "./Norma57.js";
import FlywireAccordion from "./Flywire.js";

customElements.define("tpv-accordion", TpvAccordion, { extends: "div" });
customElements.define("norma43-accordion", Norma43Accordion, { extends: "div" });
customElements.define("norma57-accordion", Norma57Accordion, { extends: "div" });
customElements.define("flywire-accordion", FlywireAccordion, { extends: "div" });

export default acordeones;
