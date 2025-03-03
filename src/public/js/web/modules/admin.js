
import tabs from "../../components/Tabs.js";
import Form from "../../components/forms/Form.js";
import nav from "../../components/Navigation.js";
import user from "../../model/web/User.js";

function fnAdmin() { // Script id
    const formProfile = new Form("#profile"); // instance
    formProfile.onSubmit(ev => {
        if (formProfile.isValid(user.validateProfile))
            formProfile.send().then(info => { tabs.setActive(0); formProfile.setOk(info); });
        ev.preventDefault();
    });
}

// Register event on page load and export default handler
nav.ready(fnAdmin);
export default fnAdmin;
