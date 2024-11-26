
import Form from "../../components/Form.js";
import nav from "../../components/Navigation.js";
import user from "../../model/web/User.js";

function fnLogin() { // Script id
    const formSignin = new Form("#signin"); // instance
    formSignin.submit(ev => {
        if (formSignin.isValid(user.validateLogin))
            formSignin.send().then(nav.redirect); // Access allowed
        ev.preventDefault();
    });

    // Register handler for navigation
    nav.setScript("login-js", fnLogin);
}

// Register event on page load and export default handler
nav.ready(fnLogin);
export default fnLogin;
