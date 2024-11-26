
import url from "url"; // Url handler
import path from "path"; //file and directory paths
import env from "dotenv"; // Environment

env.config(); // Initialize process.env

const SRC = url.fileURLToPath(new URL(".", import.meta.url));
const FILES = url.fileURLToPath(new URL("./public/files", import.meta.url));

export default {
	SERVER_HOST: "localhost",
	PORT: +(process.env.PORT || 3000),
	ADMIN_EMAIL: "pableke@gmail.com",

	DIR_SRC: SRC,
	DIR_FILES: FILES,
	DIR_THUMBS: path.join(FILES, "thumbs"),
	DIR_UPLOADS: path.join(FILES, "uploads"),

	URL_IMGS: "/public/img/png/",
	URL_THUMBS: "/public/files/thumbs/",
	URL_UPLOADS: "/public/files/uploads/",

	GMAIL_USER: process.env.GMAIL_USER,
	GMAIL_PASS: process.env.GMAIL_PASS,

	RECAPTCHA_PUBLIC: process.env.RECAPTCHA_PUBLIC,
	RECAPTCHA_PRIVATE: process.env.RECAPTCHA_PRIVATE,

	SESSION_KEY: process.env.SESSION_KEY || "EI1*cMijUIFg4^Q6uvmgB#D8lD&3iat1Axg%x@gj9OsgjN^bV1CO2R5q",

	JWT_KEY: process.env.JWT_KEY || "2ioUHb2Lf0&U3sF49o%!mw3149G4H1qwHrE*14CmOrjTEM0*Jt",
	JWT_EXPIRES: +process.env.JWT_EXPIRES || 3600000, // default=1h

	SUPABASE_URL: process.env.SUPABASE_URL,
	SUPABASE_KEY: process.env.SUPABASE_KEY,

	SQLITE_PATH: path.join(SRC, "data/db.sqlite")
};
