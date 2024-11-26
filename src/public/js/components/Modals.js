
import alerts from "./Alerts.js";

function Modals() {
	const self = this; //self instance
    const ACTIONS = {}; // default options and actions
    const dialogs = $$("dialog"); // all dialogs
    const fnTrue = () => true; // always true
    let current; // current window

    const fnDialog = id => dialogs.findBy("#modal-" + id);
    const fnClose = modal => {
        if (modal) { // has modal
            const scrollY = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            window.scrollTo(0, parseInt(scrollY || "0") * -1);
            modal.close();
        }
        alerts.working();
        return self;
    }

    this.get = name => ACTIONS[name]; // get data
    this.set = (name, fn) => { ACTIONS[name] = fn; return self; }
    this.setShowEvent = (id, fn) => self.set("show-modal-" + id, fn);
    this.setViewEvent = (id, fn) => self.set("view-modal-" + id, fn);

    this.close = id => fnClose(id ? fnDialog(id) : current);
    this.open = id => { // open modal by id
        const modal = fnDialog(id); // find modal by id
        const fnShow = ACTIONS["show-modal-" + id] || fnTrue;

        if (fnShow(modal)) { // open modal if true
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.position = "fixed";

            const fnView = ACTIONS["view-modal-" + id] || fnTrue;
            modal.showModal(); // show dialog
            current = modal; // update current modal
            alerts.working(); // hide loading frame
            fnView(modal); // fire open handler
        }
        return self;
    }

    this.load = () => {
        dialogs.forEach(dialog => {
            dialog.querySelectorAll("[href^='#modal-']").forEach(link => {
                link.onclick = ev => {
                    const href = link.getAttribute("href");
                    if (href == "#modal-close")
                        fnClose(dialog);
                    else { // if (href == "#modal-action") // specific action
                        const fnAction = ACTIONS[link.dataset.action];
                        fnAction(link, dialog); // call handler
                    }
                    ev.preventDefault(); 
                }
            });
        });
        return self;
    }
    this.addOpenEvent = el => { // add listeners to open modal
        el.querySelectorAll("[href='#modal-open']").addClick((ev, link) => {
            self.open(link.dataset.open);
            ev.preventDefault();
        });
        return self;
    }

    // Init. modals
    self.load(); // load modals
    document.body.style.width = "100%"; // init. width css prop.
    window.openModal = (xhr, status, args, selector) => { // PF hack
        window.showAlerts(xhr, status, args) && self.open(selector);
    }
    window.closeModal = (xhr, status, args) => {
        window.showAlerts(xhr, status, args) && fnClose(current);
    }
    document.onkeydown = ev => {
        if (ev.keyCode === 27) // Escape key is pressed
            fnClose(current); // close current modal
    }
}

export default new Modals();
