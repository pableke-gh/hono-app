
import { serve } from "@hono/node-server"; // http server
import dao from "./dao/factory.js"; // DAO connections
import config from "./config.js"; // Configurations
import app from "./app.js";

const OPTIONS = { port: config.PORT, fetch: app.fetch };
const server = serve(OPTIONS, ({ port }) => {
    dao.open(); // Oppen all connections
    console.log(`> Server is running on http://localhost:${port}`);
});

//capture Node.js Signals and Events
function fnExit(signal) { //exit handler
    dao.close(); // Close all db connections
    server.close(console.error); // Close http server

	console.log("--------------------\n");
    console.log(`> ${signal}: Http server closed.`);
	console.log("> " + (new Date()));
	console.log("--------------------\n");
	process.exit(0);
};
process.on("SIGHUP", fnExit); //generated on Windows when the console window is closed
process.on("SIGINT", fnExit); //Press Ctrl-C / Ctrl-D keys to exit
process.on("SIGTERM", fnExit); //kill the server using command kill [PID_number] or killall node
process.stdin.on("data", data => { (data == "exit\n") && fnExit("exit"); }); //console exit
