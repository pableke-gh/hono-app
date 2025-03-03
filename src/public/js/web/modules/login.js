
import Form from "../../components/forms/Form.js";
import nav from "../../components/Navigation.js";
import user from "../../model/web/User.js";

function fnLogin() { // Script id
    const formSignin = new Form("#signin"); // instance
    formSignin.onSubmit(ev => {
        if (formSignin.isValid(user.validateLogin))
            formSignin.send().then(nav.redirect); // Access allowed
        ev.preventDefault();
    });
}

// Register event on page load and export default handler
nav.ready(fnLogin);
export default fnLogin;
