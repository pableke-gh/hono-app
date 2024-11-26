
import coll from "./CollectionHTML.js";
import i18n from "../i18n/langs.js";

const EMPTY = [];
const fnTrue = () => true;

export default function(table, opts) {
	table = globalThis.isstr(table) ? $1(table) : table;
    if (!table)
        return; // Table element not found

    opts = opts || {}; // default options
    opts.sortClass = opts.sortClass || "sort";
    opts.sortAscClass = opts.sortAscClass || "sort-asc";
    opts.sortDescClass = opts.sortDescClass || "sort-desc";
    opts.sortNoneClass = opts.sortNoneClass || "sort-none";

    opts.activeClass = opts.activeClass || "active";
    opts.rowActionClass = opts.rowActionClass || "row-action";
    opts.msgConfirmRemove = opts.msgConfirmRemove || "remove";

    opts.msgEmptyTable = opts.msgEmptyTable || "noResults"; // default empty table message
    opts.rowEmptyTable = opts.rowEmptyTable || `<tr><td class="no-data" colspan="99">${i18n.get(opts.msgEmptyTable)}</td></tr>`;

    opts.beforeRender = opts.beforeRender || globalThis.void;
    opts.onHeader = opts.onHeader || (() => table.tHead.innerHTML);
    opts.onRender = opts.onRender || globalThis.void;
    opts.onLastRow = opts.onLastRow || globalThis.none;
    opts.onFooter = opts.onFooter || (() => table.tFoot.innerHTML);
    opts.renderFooter = opts.renderFooter ?? true;
    opts.afterRender = opts.afterRender || globalThis.void;
    opts.onRemove = opts.onRemove || fnTrue;

	const self = this; //self instance
    const RESUME = {}; //Table parameters
    const tBody = table.tBodies[0]; //body element

    let _rows = EMPTY; // default = empty array
    let _index = -1; // current item position in data

    this.clear = () => { _index = -1; return self; }
    this.set = (name, fn) => { opts[name] = fn; return self; }

    this.getData = () => _rows;
    this.getIndex = () => _index;
    this.getResume = () => RESUME;

    const fnMove = i => (i < 0) ? 0 : Math.min(i, _rows.length - 1);
    this.first = () => { _index = 0; return self; }
    this.prev = () => { _index = fnMove(_index - 1); return self; }
    this.next = () => { _index = fnMove(_index + 1); return self; }
    this.last = () => { _index = fnMove(_rows.length); return self; }

    this.getItem = i => _rows[i ?? _index];
    this.isItem = () => (_index > -1) && (_index < _rows.length);
    this.getCurrentItem = () => _rows[_index];
    this.getLastItem = () => _rows.at(-1);
    this.isEmpty = () => !_rows.length;
    this.size = () => _rows.length;

    this.getTable = () => table;
    this.getBody = () => tBody;
    this.getRow = i => tBody.rows[i ?? _index];
    this.getRows = () => tBody.rows;
    this.getCurrentRow = () => tBody.rows[_index];
    this.getLastRow = () => tBody.lastElementChild;

    this.querySelector = selector => table.querySelector(selector); // Child element
	this.querySelectorAll = selector => table.querySelectorAll(selector); // Children elements
    this.html = selector => table.querySelector(selector).innerHTML; // read text

    function fnRender(data) {
        _index = -1; // clear previous selects
        _rows = data || []; // data to render on table
        RESUME.size = _rows.length;

        tBody.classList.remove(opts.activeClass); // Remove animation
        opts.beforeRender(RESUME); // Fired init. event before render
        table.tHead.innerHTML = opts.onHeader(RESUME); // Render formatted header
        RESUME.columns = coll.size(table.tHead.rows[0]?.cells); // Number of columns <th>
        if (RESUME.size) // has data
            tBody.innerHTML = coll.render(_rows, opts.onRender, RESUME) + opts.onLastRow(RESUME);
        else
            tBody.innerHTML = opts.rowEmptyTable; // specific empty row
        if (opts.renderFooter) // render formatted footer
            table.tFoot.innerHTML = opts.onFooter(RESUME);
        opts.afterRender(RESUME); // After body and footer is rendered
        tBody.classList.add(opts.activeClass); // Add styles (animation)

        // Row listeners for change, find and remove items in body
        tBody.rows.forEach((tr, i) => {
            tr.onchange = ev => {
                _index = i; // update current item
                const el = ev.target; // change event element
                const fnChange = opts[el.name + "Change"] || globalThis.void;
                fnChange(_rows[i], el, tr, i); // call handler
            }
            tr.getElementsByClassName(opts.rowActionClass).addClick((ev, link) => {
                _index = i; // update current item
                const href = link.getAttribute("href");
                if (href == "#remove") // Remove action
                    self.removeRow(); // Remove selected item
                else if (i18n.confirm(link.dataset.confirm)) // Action on selected item
                    opts[href](_rows[i], link, tr, i); // Call action
                ev.preventDefault(); // avoid navigation
            });
        });

        // Row listeners for change, and other actions in footer
        table.tFoot.rows.forEach((tr, i) => {
            tr.onchange = ev => {
                const el = ev.target; // change event element
                const fnChange = opts[el.name + "Change"] || globalThis.void;
                fnChange(RESUME, el, tr, i); // call handler
            }
        });
        return self;
    }

    this.render = fnRender;
    this.reset = () => fnRender(EMPTY);
    this.reload = () => fnRender(_rows);
    this.push = row => { _rows.push(row); return fnRender(_rows); } // Push data and render
    this.add = row => { delete row.id; return self.push(row); } // Force insert => remove PK
    this.insert = (row, id) => { row.id = id; return self.push(row); } // New row with PK
    this.update = data => { Object.assign(_rows[_index], data); return fnRender(_rows); }
    this.save = (row, id) => (id ? self.insert(row, id) : self.update(row)); // Insert or update
    this.remove = index => { _rows.splice(index, 1); return fnRender(_rows); } // remove a row and reload table
    this.removeRow = () => {
        i18n.confirm(opts.msgConfirmRemove) // force confirm
                && opts.onRemove(_rows[_index]) // call event
                && self.remove(_index); // remove data row and rebuild table
        return self;
    }

    // Orderable columns system
    const links = table.tHead.getElementsByClassName(opts.sortClass);
    links.addClick((ev, link) => {
        const dir = link.classList.contains(opts.sortAscClass) ? opts.sortDescClass : opts.sortAscClass; // Toggle sort direction
        const column = link.getAttribute("href").substring(1); // Column name

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
    });
}
