
import coll from "./CollectionHTML.js";
import tabs from "./Tabs.js";
import i18n from "../i18n/langs.js";

export default class Table {
	#table; #tHead; #tBody; #tFoot; #opts; // table elements and options
	#RESUME = {}; // Table parameters
	#rows = []; // default = empty array
	#index = -1; // current item position in data

	constructor(table, opts) {
		this.#opts = opts || {}; // default table options
		this.#opts.sortClass = this.#opts.sortClass || "sort";
		this.#opts.sortAscClass = this.#opts.sortAscClass || "sort-asc";
		this.#opts.sortDescClass = this.#opts.sortDescClass || "sort-desc";
		this.#opts.sortNoneClass = this.#opts.sortNoneClass || "sort-none";

		this.#opts.activeClass = this.#opts.activeClass || "active";
		this.#opts.msgConfirmRemove = this.#opts.msgConfirmRemove || "remove";

		this.#opts.msgEmptyTable = this.#opts.msgEmptyTable || "noResults"; // default empty table message
		this.#opts.rowEmptyTable = this.#opts.rowEmptyTable || `<tr><td class="no-data" colspan="99">${i18n.get(this.#opts.msgEmptyTable)}</td></tr>`;
		this.#opts.refreshSelector = this.#opts.refreshSelector || ".table-refresh"; // selector for refresh elements

		this.#opts.beforeRender = this.#opts.beforeRender || globalThis.void;
		this.#opts.rowCalc = this.#opts.rowCalc || globalThis.void;
		this.#opts.onRender = this.#opts.onRender || globalThis.void;
		this.#opts.onLastRow = this.#opts.onLastRow || globalThis.none;
		this.#opts.afterRender = this.#opts.afterRender || globalThis.void;
		this.#opts.onRemove = this.#opts.onRemove || (() => Promise.resolve()); // force promise

		// Set default actions
		this.#opts["#"] = globalThis.void;
		this.#opts["#remove"] = this.remove;
		this.setTable(table); // table element
	}

	get = name => this.#opts[name];
	set = (name, fn) => { this.#opts[name] = fn; return this; }
	setOptions = data => { Object.assign(this.#opts, data); return this; }
	#setSort() { // Orderable columns system
		const links = this.#tHead.getElementsByClassName(this.#opts.sortClass);
		links.addClick((ev, link) => {
			const { sortAscClass, sortDescClass, sortNoneClass } = this.#opts; // shortcut
			const dir = link.classList.contains(sortAscClass) ? sortDescClass : sortAscClass; // Toggle sort direction
			const column = link.getAttribute("href").substring(1); // Column name

			// Update all sort icons
			links.forEach(link => { // Reset all orderable columns
				link.classList.remove(sortAscClass, sortDescClass);
				link.classList.add(sortNoneClass);
			});
			link.classList.remove(sortNoneClass);
			link.classList.add(dir);

			// Sort data by function and rebuild table
			const fnAsc = (a, b) => ((a[column] < b[column]) ? -1 : ((a[column] > b[column]) ? 1 : 0)); // Default sort
			const fnAux = this.#opts["sort-" + column] || fnAsc; // Load specific sort function
			const fnSort = (dir == sortDescClass) ? ((a, b) => fnAux(b, a)) : fnAux; // Set direction
			this.render(this.#rows.sort(fnSort)); // render sorted table
			ev.preventDefault();
		});
		return this;
	}
	setTable(table) {
		this.#table = globalThis.isstr(table) ? $1(table) : table;
		this.#table = this.#table || document.createElement("table");
		this.#tHead = this.#table.tHead || this.#table.createTHead(); //header element
		this.#tBody = this.#table.tBodies[0] || this.#table.createTBody(); //body element
		this.#tFoot = this.#table.tFoot || this.#table.createTFoot(); //footer element
		return this.#setSort();
	}

	setRowEmpty = html => this.set("rowEmptyTable", html);
	setMsgEmpty = msg => this.setRowEmpty(`<tr><td class="no-data" colspan="99">${i18n.get(msg)}</td></tr>`);
	setBeforeRender = fn => { this.#opts.beforeRender = fn; return this; }
	setHeader = html => { this.#tHead.innerHTML = html; return this.#setSort(); }
	setRowCalc = fn => { this.#opts.rowCalc = fn; return this; } 
	setRender = fn => { this.#opts.onRender = fn; return this; }
	setLastRow = fn => { this.#opts.onLastRow = fn; return this; }
	setFooter = html => { this.#tFoot.innerHTML = html; return this; }
	setAfterRender = fn => { this.#opts.afterRender = fn; return this; }
	afterRender = () => { this.#opts.afterRender(this.#RESUME); return this; }
	setSortBy = (column, fn) => this.set("sort-" + column, fn);
	setChange = (field, fn) => this.set(field + "Change", fn);
	setRemove = fn => { this.#opts.onRemove = fn; return this; } // IMPORTANT! must return a promise

	getData = () => this.#rows; // current data
	setData = data => { this.#rows = data; return this; }; // update data without render
	getIndex = () => this.#index; // current index
	getResume = () => this.#RESUME;
	getProp = name => this.#RESUME[name];
	setProp = (name, value) => { this.#RESUME[name] = value; return this; }

	#fnMove = i => (i < 0) ? 0 : Math.min(i, this.#rows.length - 1);
	first = () => { this.#index = 0; return this; }
	prev = () => { this.#index = this.#fnMove(this.#index - 1); return this; }
	next = () => { this.#index = this.#fnMove(this.#index + 1); return this; }
	last = () => { this.#index = this.#fnMove(this.#rows.length); return this; }
	clear = () => { this.#index = -1; return this; }

	getFirst = () => this.#rows[0];
	getItem = i => this.#rows[i ?? this.#index];
	getId = i => this.getItem(i)?.id; // get item id
	getIdList = () => (this.#rows && this.#rows.map(row => row.id)); // get id's
	isItem = () => (this.#index > -1) && (this.#index < this.#rows.length);
	getCurrent = () => this.#rows[this.#index]; // current data
	getCurrentItem = this.getCurrent; // synonym
	getLastItem = () => this.#rows.at(-1);
	isEmpty = () => !this.#rows.length;
	size = () => this.#rows.length;
	isChanged = () => this.#opts.isChanged;
	setChanged = val => { this.#opts.isChanged = val; return this; }

	getTable = () => this.#table;
	addClass = name => { this.#table.classList.add(name); return this; }
	getHeader = () => this.#tHead;
	getBody = () => this.#tBody;
	getRow = i => this.#tBody.rows[i ?? this.#index];
	getRows = () => this.#tBody.rows;
	getCurrentRow = () => this.#tBody.rows[this.#index];
	getLastRow = () => this.#tBody.lastElementChild;
	getFooter = () => this.#tFoot;

	getText = selector => this.#table.$1(selector)?.innerText; // read text
	invoke = (name, data, el, tr, i) => {
		const fnAction = this.#opts[name] || globalThis.void; // action by name
		fnAction(data || this.getCurrent(), el, tr, i); // call action
	}

	// Row listeners for change, find and remove items in body
	#setRowEvents = (tr, i) => {
		tr.onchange = ev => {
			this.#index = i; // update current item
			this.invoke(ev.target.name + "Change", this.#rows[i], ev.target, tr, i);
		}
		tr.$$("a[href]").setClick((ev, link) => {
			this.#index = i; // update current item
			const href = link.getAttribute("href");
			this.invoke(href, this.#rows[i], link, tr, i);
			ev.preventDefault(); // avoid navigation
		});
	}
	view(data) {
		this.#index = -1; // clear previous selects
		this.#rows = data || []; // data to render on table
		this.#RESUME.size = this.#rows.length; // init. resume

		this.#tBody.classList.remove(this.#opts.activeClass); // Remove animation
		this.#opts.beforeRender(this.#RESUME); // Fired event before render
		this.refreshHeader(); // refresh table header
		this.#RESUME.columns = coll.size(this.#tHead.rows[0]?.cells); // Number of columns <th>
		this.#tBody.innerHTML = this.#RESUME.size // has data
						? (coll.render(this.#rows, this.#opts.onRender, this.#RESUME) + this.#opts.onLastRow(this.#RESUME))
						: this.#opts.rowEmptyTable; // specific empty row
		this.afterRender().refreshFooter(); // After body event and refresh footer
		this.#tBody.classList.add(this.#opts.activeClass); // Add styles (animation)
		tabs.setHeight(); // resize iframe height
		return this;
	}
	render(data) {
		this.view(data); // render table data
		this.#tBody.rows.forEach(this.#setRowEvents); // row listeners
		return this.setChanged(true); // rendered force indicator
	}

	reset = this.view; // reset table
	reload = () => this.render(this.#rows);
	push = row => { this.#rows.push(row); return this.reload(); } // Push data and render
	add = row => { delete row.id; return this.push(row); } // Force insert => remove PK
	insert = (row, id) => { row.id = id; return this.push(row); } // New row with PK
	update = data => { Object.assign(this.getCurrent(), data); return this.reload(); }
	replace(data, i) { this.#rows[i ?? this.#index] = data; return this; } // replace current row position
	save = (row, id) => (id ? this.insert(row, id) : this.update(row)); // Insert or update

	#fnRefresh = (el, data) => { el.$$(this.#opts.refreshSelector).refresh(data, this.#opts); return this; } // render table elements
	refreshHeader = data => this.#fnRefresh(this.#tHead, data || this.#RESUME); // refresh table header
	refreshRow = data => this.#fnRefresh(this.getCurrentRow(), data || this.getCurrent()); // refresh a row
	refreshBody = () => { this.#tBody.rows.forEach((tr, i) => this.#fnRefresh(tr, this.#rows[i])); return this.setChanged(true); } // refresh each row
	refreshFooter = () => this.#fnRefresh(this.#tFoot, this.#RESUME); // refresh footer only
	refresh = () => this.recalc().refreshBody().refreshFooter(); // recalc. all rows and refresh body and footer
	recalc = () => {
		this.#opts.beforeRender(this.#RESUME); // Fired init. event before render
		this.#rows.forEach((row, i) => this.#opts.rowCalc(row, this.#RESUME, i)); // recalc. all rows
		return this.afterRender().setChanged(true); // force refresh indicator
	}

	flush = index => {
		index = index ?? this.#index; // default current
		return this.#opts.onRemove(this.#rows[index]).then(() => {
			this.#rows.splice(index, 1); // remove row data
			this.#RESUME.size = this.#rows.length; // update size
			this.#tBody.removeChild(this.#tBody.rows[index]); // remove tr element
			if (this.#rows.length) // is empty table?
				this.#tBody.rows.forEach(this.#setRowEvents); // update listeners
			else
				this.#tBody.innerHTML = this.#opts.rowEmptyTable; // empty body
			this.recalc().refreshFooter(); // refresh footer
		});
	}
	remove = () => i18n.confirm(this.#opts.msgConfirmRemove) ? this.flush(this.#index) : Promise.reject();
	extract = index => i18n.confirm(this.#opts.msgConfirmRemove) ? this.flush(index) : Promise.reject();
}
