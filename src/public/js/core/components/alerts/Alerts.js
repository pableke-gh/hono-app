
import Alerts from "./AlertsContainer.js";
import Alert from "./Alert.js";

// first define web custom elements
customElements.define("alerts-box", Alerts, { extends: "div" });
customElements.define("alert-box", Alert, { extends: "div" });

// IMPORTANT! instance alerts after definition
const alerts = new Alerts(); // singleton instance
document.body.appendChild(alerts); // add alerts to body

export default alerts; // singleton instance
