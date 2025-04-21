
import dom from "./forms/DomBox.js";
import coll from "./CollectionHTML.js";
import i18n from "../i18n/langs.js";

const fnTrue = () => true;

export default function(table, opts) {
	table = globalThis.isstr(table) ? $1(table) : table;

	opts = opts || {}; // default options
	opts.sortClass = opts.sortClass || "sort";
	opts.sortAscClass = opts.sortAscClass || "sort-asc";
	opts.sortDescClass = opts.sortDescClass || "sort-desc";
	opts.sortNoneClass = opts.sortNoneClass || "sort-none";

	opts.activeClass = opts.activeClass || "active";
	opts.rowActionClass = opts.rowActionClass || "row-action";
	opts.textRenderClass = opts.textRenderClass || "text-render";
	opts.msgConfirmRemove = opts.msgConfirmRemove || "remove";

	opts.msgEmptyTable = opts.msgEmptyTable || "noResults"; // default empty table message
	opts.rowEmptyTable = opts.rowEmptyTable || `<tr><td class="no-data" colspan="99">${i18n.get(opts.msgEmptyTable)}</td></tr>`;

	opts.beforeRender = opts.beforeRender || globalThis.void;
	opts.onHeader = opts.onHeader || (() => table.tHead.innerHTML);
	opts.rowCalc = opts.rowCalc || fnTrue;
	opts.onRender = opts.onRender || globalThis.void;
	opts.onLastRow = opts.onLastRow || globalThis.none;
	opts.onFooter = opts.onFooter || (() => table.tFoot.innerHTML);
	opts.renderFooter = opts.renderFooter ?? true;
	opts.afterRender = opts.afterRender || globalThis.void;
	opts.onRemove = opts.onRemove || fnTrue;

	const self = this; //self instance
    const RESUME = {}; //Table parameters
	const tHead = table.tHead || table.createTHead(); //header element
	const tBody = table.tBodies[0] || table.createTBody(); //body element
	const tFoot = table.tFoot || table.createTFoot(); //footer element

    let _rows = []; // default = empty array
    let _index = -1; // current item position in data
	let _isChanged; // bool indicator

	this.get = name => opts[name];
	this.set = (name, fn) => { opts[name] = fn; return self; }
	this.clear = () => { _index = -1; return self; }

	this.setRowEmpty = html => self.set("rowEmptyTable", html);
	this.setMsgEmpty = msg => self.setRowEmpty(`<tr><td class="no-data" colspan="99">${i18n.get(msg)}</td></tr>`);
	this.setBeforeRender = fn => { opts.beforeRender = fn; return self; }
	this.setHeader = fn => { opts.onHeader = fn; return self; }
	this.setRowCalc = fn => { opts.rowCalc = fn; return self; } 
	this.setRender = fn => { opts.onRender = fn; return self; }
	this.setLastRow = fn => { opts.onLastRow = fn; return self; }
	this.setFooter = fn => { opts.onFooter = fn; return self; }
	this.setAfterRender = fn => { opts.afterRender = fn; return self; }
	this.setSortBy = (column, fn) => self.set("sort-" + column, fn);
	this.setChange = (field, fn) => self.set(field + "Change", fn);
	this.setRemove = fn => { opts.onRemove = fn; return self; }

	this.getData = () => _rows;
	this.getIndex = () => _index;
	this.getResume = () => RESUME;
	this.getProp = name => RESUME[name];

	const fnMove = i => (i < 0) ? 0 : Math.min(i, _rows.length - 1);
	this.first = () => { _index = 0; return self; }
	this.prev = () => { _index = fnMove(_index - 1); return self; }
	this.next = () => { _index = fnMove(_index + 1); return self; }
	this.last = () => { _index = fnMove(_rows.length); return self; }

	this.getFirst = () => _rows[0];
	this.getItem = i => _rows[i ?? _index];
	this.isItem = () => (_index > -1) && (_index < _rows.length);
	this.getCurrentItem = () => _rows[_index];
	this.getLastItem = () => _rows.at(-1);
	this.isEmpty = () => !_rows.length;
	this.size = () => _rows.length;
	this.isChanged = () => _isChanged;
	this.setChanged = val => { _isChanged = val; return self; }

	this.getTable = () => table;
	this.getHeader = () => tHead;
	this.getBody = () => tBody;
	this.getRow = i => tBody.rows[i ?? _index];
	this.getRows = () => tBody.rows;
	this.getCurrentRow = () => tBody.rows[_index];
	this.getLastRow = () => tBody.lastElementChild;
	this.getFooter = () => tFoot;

	this.querySelector = selector => table.querySelector(selector);
	this.querySelectorAll = selector => table.querySelectorAll(selector);
    this.getText = selector => dom.getText(table.querySelector(selector)); // read text

	function fnChangeEvent(data, el, tr, i) {
		const fnChange = opts[el.name + "Change"];
		fnChange && fnChange(data, el, tr, i);
	}
	// Row listeners for change, find and remove items in body
	function addRowEvents(tr, i) {
		tr.onchange = ev => {
			_index = i; // update current item
			fnChangeEvent(_rows[i], ev.target, tr, i);
		}
		tr.getElementsByClassName(opts.rowActionClass).setClick((ev, link) => {
			_index = i; // update current item
			const href = link.getAttribute("href");
			opts[href](_rows[i], link, tr, i); // Call action
			ev.preventDefault(); // avoid navigation
		});
	}
    function fnRender(data) {
		_index = -1; // clear previous selects
		_rows = data || []; // data to render on table
		RESUME.size = _rows.length; // init. resume

		tBody.classList.remove(opts.activeClass); // Remove animation
		opts.beforeRender(RESUME); // Fired init. event before render
		tHead.innerHTML = opts.onHeader(RESUME); // Render formatted header
		RESUME.columns = coll.size(tHead.rows[0]?.cells); // Number of columns <th>
		tBody.innerHTML = RESUME.size // has data
						? (coll.render(_rows, opts.onRender, RESUME) + opts.onLastRow(RESUME))
						: opts.rowEmptyTable; // specific empty row
		tFoot.innerHTML = opts.onFooter(RESUME); // update table footer
		opts.afterRender(RESUME); // After body and footer is rendered
		tBody.classList.add(opts.activeClass); // Add styles (animation)
		_isChanged = true; // rendered force indicator

		tBody.rows.forEach(addRowEvents);
		tFoot.rows.forEach((tr, i) => { // Row listeners for change footer
			tr.onchange = ev => fnChangeEvent(RESUME, ev.target, tr, i);
		});
		return self;
	}

	this.render = fnRender;
	this.reset = () => fnRender();
	this.reload = () => fnRender(_rows);
	this.push = row => { _rows.push(row); return fnRender(_rows); } // Push data and render
	this.add = row => { delete row.id; return self.push(row); } // Force insert => remove PK
	this.insert = (row, id) => { row.id = id; return self.push(row); } // New row with PK
	this.update = data => { Object.assign(_rows[_index], data); return fnRender(_rows); }
	this.save = (row, id) => (id ? self.insert(row, id) : self.update(row)); // Insert or update
	this.remove = index => { index = index ?? _index; _rows.splice(index, 1); return fnRender(_rows); } // remove a row and reload table
	const fnConfirmRemove = index => (i18n.confirm(opts.msgConfirmRemove) && opts.onRemove(_rows[index])); // confirmation message
	this.removeRow = () => { fnConfirmRemove(_index) && self.remove(_index); return self; } // remove row and rebuild table

	const fnRefresh = (el, data) => el.getElementsByClassName(opts.textRenderClass).forEach(el => el.render(data)); // render table elements
	this.refreshBody = () => { tBody.rows.forEach((tr, i) => fnRefresh(tr, _rows[i])); return self; } // refresh each row
	this.refreshFooter = () => { fnRefresh(tFoot, RESUME); return self; } // refresh footer only
	this.refresh = () => self.recalc().refreshBody().refreshFooter(); // recalc. all rows and refresh body and footer
	this.recalc = () => {
		opts.beforeRender(RESUME); // Fired init. event before render
		_rows.forEach(row => opts.rowCalc(row, RESUME)); // recalc. all rows
		opts.afterRender(RESUME); // After body recalc
		_isChanged = true; // refresh force indicator
		return self;
	}

	this.flush = index => {
		index = index ?? _index;
		_rows.splice(index, 1); // remove row
		RESUME.size = _rows.length; // update size
		tBody.removeChild(tBody.rows[index]); // remove row
		if (_rows.length) // is empty table?
			tBody.rows.forEach(addRowEvents); // update listeners
		else
			tBody.innerHTML = opts.rowEmptyTable; // empty body
		return self.recalc().refreshFooter(); // refresh footer
	}
	this.flushRow = () => { // remove row and rebuild table
		fnConfirmRemove(_index) && self.flush(_index);
		return self;
	}

	// Orderable columns system
	const links = tHead.getElementsByClassName(opts.sortClass);
	links.addClick((ev, link) => {
		const column = link.getAttribute("href").substring(1); // Column name
		const dir = link.classList.contains(opts.sortAscClass) ? opts.sortDescClass : opts.sortAscClass; // Toggle sort direction

		// Update all sort icons
		links.forEach(link => { // Reset all orderable columns
			link.classList.remove(opts.sortAscClass, opts.sortDescClass);
			link.classList.add(opts.sortNoneClass);
		});
		link.classList.remove(opts.sortNoneClass);
		link.classList.add(dir);

		// Sort data by function and rebuild table
		const fnAsc = (a, b) => ((a[column] < b[column]) ? -1 : ((a[column] > b[column]) ? 1 : 0)); // Default sort
		const fnAux = opts["sort-" + column] || fnAsc; // Load specific sort function
		const fnSort = (dir == opts.sortDescClass) ? ((a, b) => fnAux(b, a)) : fnAux; // Set direction
		fnRender(_rows.sort(fnSort)); // render sorted table
		ev.preventDefault();
	});

	// Define default actions
	opts["#remove"] = self.removeRow;
	opts["#flush"] = self.flushRow;
}
