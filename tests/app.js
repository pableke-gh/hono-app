
import app from "../src/app.js";
import util from "app/lib/util.js";
import send from "app/lib/mailer.js";

const sendMailHTML = html => {
    return send({
        to: "pableke@gmail.com",
        subject: "Mailer test",
        html
    });
}

export default {
    test: () => app.request("/test"),
    email: () => app.request("/email").then(res => res.text()).then(sendMailHTML),
    jwt: user => util.verify(util.sign(user)),
    zip: (output, files) => util.zip(output, files)
}
