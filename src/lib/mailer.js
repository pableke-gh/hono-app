
import nodemailer from "nodemailer"; //send emails
import config from "../config.js"; // Configurations

// create reusable transporter object using the default SMTP transport
// allow non secure apps to access gmail: https://myaccount.google.com/lesssecureapps
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS
    }
});

// verify connection configuration
transporter.verify(function(err) {
    console.log(err || "> Mail server is ready to take our messages");
});

const MESSAGE = {
    from: "info@gmail.com", // sender address
    to: "pablo.rosique@upct.es", // list of receivers
    subject: "Mailer no reply", // Subject line
    text: "Email submitted", // plain text body
    html: "<html><body>Email submitted</body></html>" // html contents
    /*attachments: [ // array of attachment objects
        { filename: "text1.txt", content: "hello world!" }, // utf-8 string as an attachment
        { filename: "test.zip", content: fs.createReadStream("src/public/temp/test.zip") }, //stream as an attachment
        { filename: "license.txt", path: "https://raw.github.com/nodemailer/nodemailer/master/LICENSE" }, // use URL as an attachment
        { filename: "text2.txt", content: "aGVsbG8gd29ybGQh", encoding: "base64" } // encoded string as an attachment
    ]*/
}

export default mail => {
    mail = mail || MESSAGE;
    mail.from = mail.from || MESSAGE.from;
    mail.to = mail.to || MESSAGE.to;
    mail.subject = mail.subject || MESSAGE.subject;
    mail.html = mail.html || MESSAGE.html;
    //mail.attachments = mail.attachments || MESSAGE.attachments;

    // Return promise to send email
    return new Promise(function(resolve, reject) {
        transporter.sendMail(mail, (err, info) => err ? reject(err) : resolve(info));
    });
}
