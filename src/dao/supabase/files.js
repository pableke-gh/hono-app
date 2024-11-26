
export default function(db) {
	const self = this; //self instance

    this.filter = user => {
        return db.from("files").select().eq("user_id", user);
    }

    this.insert = data => {
        return db.from("files").insert(data);
    }
}
