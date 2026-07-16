
class TablesContainer {
	#tables = {}; // all tables container
	#opts = {
		sortClass: "sort", sortAscClass: "sort-asc", sortDescClass: "sort-desc", sortNoneClass: "sort-none",
		activeClass: "active", msgConfirmRemove: "remove", reloadClass: "table-reload", // class selector
		msgEmptyTable: "noResults" // default empty table message
	};

	getOptions = () => this.#opts;
	get = name => this.#tables[name];
	set(table, name) {
		if (name) // register named tables
			this.#tables[name] = table;
	}
}

export default new TablesContainer();
