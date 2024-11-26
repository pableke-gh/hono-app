
import { createClient } from "@supabase/supabase-js"
import config from "#config.js"; // Configurations

import Files from "./files.js";

// Database client
const db = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

const file = new Files(db);

export default {
	file, 

	open: globalThis.void,
	close: function() {
		//db.close(console.error); // close the database connection
		console.log("> Supabase closed.");
	}
};
