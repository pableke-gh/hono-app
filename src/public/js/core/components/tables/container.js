
class TablesContainer {
	#tables = {}; // all tables container
	#opts = {
		sortClass: "sort", sortAscClass: "sort-asc", sortDescClass: "sort-desc", sortNoneClass: "sort-none",
		activeClass: "active", msgConfirmRemove: "remove", reloadClass: "table-reload", // class selector
		msgEmptyTable: "noResults" // default empty table message
	};

	getOptions = () => this.#opts;
	getAll = () => this.#tables;
	get = name => this.#tables[name];
	set(name, table) { this.#tables[name] = table; } // register named tables

	getRegistros = () => this.get("solicitudes"); // tabla de solicitudess / registros
	getSolicitudes = () => this.get("solicitudes"); // tabla de solicitudess / registros
}

export default new TablesContainer();
