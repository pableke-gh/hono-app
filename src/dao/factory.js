
import sqlite from "./sqlite/factory.js";
import supabase from "./supabase/factory.js";

export default {
	sqlite, supabase,

	open: function() {
		sqlite.open();
		supabase.open();
		console.log("> DAO Factory open.");
	},
	close: function() {
		sqlite.close();
		supabase.close();
		console.log("> DAO Factory closed.");
	}
};
