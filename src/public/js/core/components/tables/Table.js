
import i18n from "../../i18n/langs.js";
import tables from "./container.js";

export default class TableHTML extends HTMLTableElement {
	#rows = []; // default = empty array
	#index = -1; // current item position in data
	#RESUME = { renders: 0 }; // Table resume parameters
	#tBody = this.tBodies[0] || this.createTBody(); // body element
	#opts = Object.assign({}, tables.getOptions(), this.dataset);

	constructor() { // Default initialization
		super(); // Must call super before 'this'
		this.id && tables.set(this.id, this); // register table
		this.setMsgEmpty(this.#opts.msgEmptyTable); // empty message

		this.#opts["#"] = globalThis.void;
		this.#opts["#remove"] = this.remove;
		this.#opts["text-render"] = (el, data) => {
			el.dataset.template = el.dataset.template || el.innerHTML; // save current template
			el.innerHTML = i18n.render(el.dataset.template, data); // display new text
			return true; // set visible
		}
	}

	get = name => this.#opts[name];
	set = (name, fn) => { this.#opts[name] = fn; return this; }
	setOptions = data => { Object.assign(this.#opts, data); return this; }
	getName = () => "table"; // default name for table
	getHeaders = () => this.tHead.querySelectorAll("th").map(th => th.textContent);

	setRowEmpty = html => this.set("rowEmptyTable", html);
	setMsgEmpty = msg => this.setRowEmpty(`<tr><td class="no-data" colspan="99">${i18n.msg(msg)}</td></tr>`);
	setMsgConfirm = msg => this.set("msgConfirmRemove", msg); // msg de confirmación de borrado
	beforeRender() {}; // event before render table (optional)
	beforeRow(data, i) { this.#RESUME.index = i; this.#RESUME.count = i + 1; } // optional event
	row(data, i) { throw new Error("Method 'row' must be implemented."); }; // required row render function
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
	isSelected = () => (this.#index > -1);
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
		const fn = this.#opts[name]; // action by name
		fn && fn(data || this.getCurrent(), el, tr, i); // call action
	}

	// Row listeners for change, find and remove items in body
	#setRowEvents = (tr, i) => {
		tr.onchange = ev => {
			this.#index = i; // update current item
			this.invoke(ev.target.name + "Change", this.#rows[i], ev.target, tr, i);
		}
		tr.querySelectorAll("a[href]").forEach(link => {
			link.onclick = ev => {
				this.#index = i; // update current item
				const href = link.getAttribute("href");
				this.invoke(href, this.#rows[i], link, tr, i);
				ev.preventDefault(); // avoid navigation
			}
		});
	}
	view(data) {
		this.#index = -1; // clear previous selects
		this.#rows = data || []; // data to render on table
		this.#RESUME.renders++; // Increment render count
		this.#RESUME.size = this.#rows.length; // init. resume
		this.#RESUME.columns = this.tHead.rows[0]?.cells.length; // Number of columns <th>

		this.#tBody.classList.remove(this.#opts.activeClass); // Remove animation
		this.beforeRender(this.#RESUME); // Fired event before render
		this.reloadHeader(); // reload table header
		const renderRow = (row, i) => { this.beforeRow(row, i, this.#RESUME); return this.row(row, i, this.#RESUME); };
		const renderBody = () => (this.#rows.map(renderRow).join("") + this.lastRow(this.#RESUME));
		this.#tBody.innerHTML = this.#RESUME.size ? renderBody() : this.#opts.rowEmptyTable; // set body
		this.afterRender(this.#RESUME); // After body event
		this.reloadFooter(); // reload footer
		this.#tBody.classList.add(this.#opts.activeClass); // Add styles (animation)
		return this;
	}
	render(data) {
		this.view(data); // render table data
		this.#tBody.rows.forEach(this.#setRowEvents); // row listeners
		return this;
	}
	recalc() {
		this.beforeRender(this.#RESUME); // Fired event before render
		this.#rows.forEach((row, i) => this.beforeRow(row, i, this.#RESUME)); // recalc. each row
		this.afterRender(this.#RESUME); // Fire after render event
		return this;
	}

	reset = this.view; // reset table
	push(row) { this.#rows.push(row); return this.render(this.#rows); } // Push data and render
	add(row) { delete row.id; return this.push(row); } // Force insert => remove PK
	insert = (row, id) => { row.id = id; return this.push(row); } // New row with PK
	update = data => { Object.assign(this.getCurrent(), data); return this.render(this.#rows); }
	save = (row, id) => (id ? this.insert(row, id) : this.update(row)); // Insert or update

	#fnReload = (el, data) => {
		// IMPORTANTE! element puede no estar seleccionado (ej: al crear)
		el?.getElementsByClassName(this.#opts.reloadClass).forEach(el => {
			const value = el.dataset.reload; // get update handler by name
			const fnReload = data[value] || this.#opts[value]; // get handler
			el.classList.toggle("hide", !fnReload(el, data)); // update element
		});
		return this;
	}
	reloadHeader() { return this.#fnReload(this.tHead, this.#RESUME); } // reload table header
	reloadRow() { return this.#fnReload(this.getCurrentRow(), this.getCurrent()); } // reload a row
	reloadBody() { this.#tBody.rows.forEach((tr, i) => this.#fnReload(tr, this.#rows[i])); return this; } // reload each row
	reloadFooter() { return this.#fnReload(this.tFoot, this.#RESUME); } // reload footer only
	reload() { return this.recalc().reloadBody().reloadFooter(); } // recalc. all rows and reload body and footer

	flush() {
		if (!this.isSelected()) return; // nothing to remove
		this.#rows.splice(this.#index, 1); // remove row data
		this.#RESUME.size = this.#rows.length; // update size
		this.#tBody.removeChild(this.getCurrentRow()); // remove tr element
		if (this.#rows.length) // is empty table?
			this.#tBody.rows.forEach(this.#setRowEvents); // update listeners
		else
			this.#tBody.innerHTML = this.#opts.rowEmptyTable; // empty body
		this.recalc().reloadFooter(); // reload footer
	}
	remove = () => { i18n.confirm(this.#opts.msgConfirmRemove) && this.flush(); }
}
