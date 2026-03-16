
import coll from "./CollectionHTML.js";
import tabs from "./Tabs.js";
import i18n from "../i18n/langs.js";

export default class TableHTML extends HTMLTableElement {
	#rows = []; // default = empty array
	#index = -1; // current item position in data
	#RESUME = {}; // Table resume parameters
	#tBody = this.tBodies[0] || this.createTBody(); // body element
	#opts = {
		sortClass: "sort", sortAscClass: "sort-asc", sortDescClass: "sort-desc", sortNoneClass: "sort-none",
		activeClass: "active", msgConfirmRemove: "remove",

		msgEmptyTable: "noResults", // default empty table message
		rowEmptyTable: `<tr><td class="no-data" colspan="99">${i18n.get("noResults")}</td></tr>`,
		refreshSelector: ".table-refresh" // selector for refresh elements
	};

	constructor() {
		super(); // Must call super before 'this'
		// Table default initialization
		this.#opts["#"] = globalThis.void;
		this.#opts["#remove"] = this.remove;
	}

	get = name => this.#opts[name];
	set = (name, fn) => { this.#opts[name] = fn; return this; }
	setOptions = data => { Object.assign(this.#opts, data); return this; }

	setRowEmpty = html => this.set("rowEmptyTable", html);
	setMsgEmpty = msg => this.setRowEmpty(`<tr><td class="no-data" colspan="99">${i18n.msg(msg)}</td></tr>`);
	setMsgConfirm = msg => this.set("msgConfirmRemove", msg); // msg de confirmación de borrado
	beforeRender() {}; // event before render table (optional)
	beforeRow() {} // row calculation before render each row (optional)
	row() { throw new Error("Method 'row' must be implemented."); }; // required row render function
	lastRow = () => ""; // specific last row after render all data (optional)
	afterRender() {}; // event fired after render table (optional)
	setSortBy = (column, fn) => this.set("sort-" + column, fn);
	setChange = (field, fn) => this.set(field + "Change", fn);

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
	getId = () => this.#rows[this.#index]?.id; // get current id
	getIdList = () => (this.#rows && this.#rows.map(row => row.id)); // get id's
	isItem = () => (this.#index > -1) && (this.#index < this.#rows.length);
	getCurrent = () => this.#rows[this.#index]; // current data
	getCurrentItem = this.getCurrent; // synonym
	getLastItem = () => this.#rows.at(-1);
	isEmpty = () => !this.#rows.length;
	size = () => this.#rows.length;

	getBody = () => this.#tBody;
	getRow = i => this.#tBody.rows[i ?? this.#index];
	getRows = () => this.#tBody.rows;
	getCurrentRow = () => this.#tBody.rows[this.#index];
	getLastRow = () => this.#tBody.lastElementChild;

	getText = selector => this.querySelector(selector)?.innerText; // read text
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
	#recalc = (row, i) => {
		this.#RESUME.index = i;
		this.#RESUME.count = i + 1;
		this.beforeRow(row, this.#RESUME);
		return this;
	}
	view(data) {
		this.#index = -1; // clear previous selects
		this.#rows = data || []; // data to render on table
		this.#RESUME.size = this.#rows.length; // init. resume
		this.#RESUME.columns = coll.size(this.tHead.rows[0]?.cells); // Number of columns <th>

		this.#tBody.classList.remove(this.#opts.activeClass); // Remove animation
		this.beforeRender(this.#RESUME); // Fired event before render
		this.refreshHeader(); // refresh table header
		const renderRows = () => this.#rows.map((row, i) => this.#recalc(row, i).row(row, this.#RESUME)).join("");
		this.#tBody.innerHTML = this.#RESUME.size // has data
						? (renderRows() + this.lastRow(this.#RESUME)) // set tBody
						: this.#opts.rowEmptyTable; // specific empty row
		this.afterRender(this.#RESUME); // After body event
		this.refreshFooter(); // Refresh footer
		this.#tBody.classList.add(this.#opts.activeClass); // Add styles (animation)
		tabs.setHeight(); // resize iframe height
		return this;
	}
	render(data) {
		this.view(data); // render table data
		this.#tBody.rows.forEach(this.#setRowEvents); // row listeners
		return this;
	}
	recalc() {
		this.beforeRender(this.#RESUME); // Fired event before render
		this.#rows.forEach(this.#recalc); // recalc all rows
		this.afterRender(this.#RESUME); // Fire after render event
		return this;
	}

	reset = this.view; // reset table
	reload = () => this.render(this.#rows);
	push(row) { this.#rows.push(row); return this.reload(); } // Push data and render
	add(row) { delete row.id; return this.push(row); } // Force insert => remove PK
	insert = (row, id) => { row.id = id; return this.push(row); } // New row with PK
	update = data => { Object.assign(this.getCurrent(), data); return this.reload(); }
	save = (row, id) => (id ? this.insert(row, id) : this.update(row)); // Insert or update

	// IMPORTANTE! element puede no estar seleccionado (ej: al crear)
	#fnRefresh = (el, data) => { el?.$$(this.#opts.refreshSelector).refresh(data, this.#opts); return this; }
	refreshHeader = () => this.#fnRefresh(this.tHead, this.#RESUME); // refresh table header
	refreshRow() { return this.#fnRefresh(this.getCurrentRow(), this.getCurrent()); } // refresh a row
	refreshBody() { this.#tBody.rows.forEach((tr, i) => this.#fnRefresh(tr, this.#rows[i])); return this; } // refresh each row
	refreshFooter = () => this.#fnRefresh(this.tFoot, this.#RESUME); // refresh footer only
	refresh = () => this.recalc().refreshBody().refreshFooter(); // recalc. all rows and refresh body and footer

	onRemove = () => Promise.resolve(); // IMPORTANT! must return a promise
	flush = () => this.onRemove(this.getCurrent()).then(() => {
		if (this.isEmpty()) return; // nothing to remove
		this.#rows.splice(this.#index, 1); // remove row data
		this.#RESUME.size = this.#rows.length; // update size
		this.#tBody.removeChild(this.getCurrentRow()); // remove tr element
		if (this.#rows.length) // is empty table?
			this.#tBody.rows.forEach(this.#setRowEvents); // update listeners
		else
			this.#tBody.innerHTML = this.#opts.rowEmptyTable; // empty body
		this.recalc().refreshFooter(); // refresh footer
	});
	remove = () => i18n.confirm(this.#opts.msgConfirmRemove) ? this.flush() : Promise.reject();
}
