
import ab from "./array-box.js";
import nb from "./number-box.js";
import sb from "./string-box.js";

function DomBox(opts) {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const CONFIG = {
		//maxFileSize: 6000000, //6MB
		classHide: "hide", // CSS class name
		classAlerts: "alerts", // parent container
		classAlertText: "alert-text",
		classAlertClose: "alert-close",
		classInputError: "ui-error",
		classTipError: "ui-errtip",
		//classSortNone: "sort-none",
		//classSortDesc: "sort-desc",
		//classSortAsc: "sort-asc",
		//classSortTable: "sort",
		classCheckList: "check-list",
		classCheckGroup: "check-group"
	}

	// Update congig
	Object.assign(CONFIG, opts);
	//const TIP_ERR_SELECTOR = "." + CONFIG.classTipError;
	//const CHEK_LIST_SELECTOR = "." + CONFIG.classCheckList;
	//const CHEK_GROUP_SELECTOR = "." + CONFIG.classCheckGroup;

	const fnSelf = () => self;
	const fnSplit = str => str ? str.split(/\s+/) : []; // class separator
	const fnQuery = (elem, parent) => sb.isstr(elem) ? self.get(elem, parent) : elem;
	const fnQueryAll = list => sb.isstr(list) ? $$(list) : list;

	this.get = (selector, el) => (el || document).querySelector(selector);
	this.getAll = (selector, el) => (el || document).querySelectorAll(selector);
	this.closest = (selector, el) => el && el.closest(selector);

	this.getNavLang = () => navigator.language || navigator.userLanguage; //default browser language
	this.getLang = () => document.documentElement.getAttribute("lang") || self.getNavLang(); //get lang by tag
	this.redir = (url, target) => { url && window.open(url, target || "_blank"); return self; };

	// Iterators and Filters
	const fnEach = (list, fn) => fnSelf(ab.each(list, fn));
	this.each = function(list, fn) {
		if (list) // Is DOMElement, selector or NodeList
			(list.nodeType == 1) ? fn(list) : fnEach(fnQueryAll(list), fn);
		return self;
	}
	this.reverse = (list, cb) => { ab.reverse(list, cb); return self; }
	this.indexOf = (el, list) => ab.findIndex(list || el.parentNode.children, elem => (el == elem));
	this.findIndex = (selector, list) => ab.findIndex(list, el => el.matches(selector));
	this.find = (selector, list) => ab.find(list, el => el.matches(selector));
	this.toArray = list => [...fnQueryAll(list)];
	this.filter = (selector, list) => [...list].filter(el => el.matches(selector));
	this.apply = (selector, list, fn) => fnEach(list, (el, i) => el.matches(selector) && fn(el, i));
	this.sort = (list, cb)  => self.toArray(list).sort(cb);
	this.map = (list, cb)  => self.toArray(list).map(cb);
	this.values = list => self.map(list, el => el.value);

	// Inputs and focusables selectors
	const INPUTS = "input,textarea,select";
	const FOCUSABLE = "[tabindex]:not([type=hidden],[readonly],[disabled])";
	const fnVisible = el => (el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	const fnFocus = input => (fnVisible(input) && input.matches(FOCUSABLE));

	this.inputs = el => self.getAll(INPUTS, el);
	this.focus = el => { el && el.focus(); return self; }

	// Inputs values
	function fnSetVal(el, value) {
		if ((el.tagName == "SELECT") && !value)
			el.selectedIndex = 0;
		else
			el.value = value || ""; // String
		return self;
	}
	function fnSetText(el, value) {
		el.classList.toggle(CONFIG.classHide, !value);
		el.innerText = value;
		return self;
	}
	this.setText = function(el, value, parent) {
		el = fnQuery(el, parent); //find element
		return el ? fnSetText(el, value ?? EMPTY) : self;
	}

	function fnSetHtml(el, value) {
		el.classList.toggle(CONFIG.classHide, !value);
		el.innerHTML = value;
		return self;
	}
	this.setHtml = function(el, value, parent) {
		el = fnQuery(el, parent); //find element
		return el ? fnSetHtml(el, value ?? EMPTY) : self;
	}
	this.html = function(list, value) {
		value = value ?? EMPTY; // define value as string
		return self.each(list, el => fnSetHtml(el, value));
	}

	this.empty = el => !el || !el.innerHTML || (el.innerHTML.trim() === EMPTY);
	this.mask = (list, mask, name) => self.each(list, (el, i) => el.classList.toggle(name, nb.mask(mask, i))); //toggle class by mask
	this.view = (list, mask) => self.mask(list, ~mask, CONFIG.classHide); //toggle hide class by mask
	this.select = function(list, mask) {
		return self.each(list, el => { //iterate over all selects
			const option = el.options[el.selectedIndex]; //get current option
			if (self.view(el.options, mask).hasClass(option, CONFIG.classHide)) //option hidden => force change
				el.selectedIndex = self.findIndex(":not(.hide)", el.options);
		});
	}

	// Format and parse contents
	const TEMPLATES = {}; //container
	//this.getTpl = name => TEMPLATES[name];
	//this.setTpl = (name, tpl) => { TEMPLATES[name] = tpl; return self; }
	//this.loadTemplates = () => self.each("template[id]", tpl => self.setTpl(tpl.id, tpl.innerHTML));
	this.render = function(el, formatter) {
		el.id = el.id || ("_" + sb.rand()); // force unique id for element
		let key = el.dataset.tpl || el.id; // tpl asociated
		TEMPLATES[key] = TEMPLATES[key] || el.innerHTML;
		return fnSetHtml(el, formatter(TEMPLATES[key]));
	}

	// Styles
	//const isHide = el => el.classList.contains(CONFIG.classHide);
	const fnShow = el => el.classList.remove(CONFIG.classHide);
	const fnHide = el => el.classList.add(CONFIG.classHide);

	this.isVisible = el => el && fnVisible(el);
	this.visible = (el, parent) => self.isVisible(fnQuery(el, parent));
	this.show = list => self.each(list, fnShow);
	this.hide = list => self.each(list, fnHide);
	this.hasClass = (el, names) => el && fnSplit(names).some(name => el.classList.contains(name));
	this.addClass = function(list, names) {
		names = fnSplit(names); // Split value by " " (class separator)
		return self.each(list, el => names.forEach(name => el.classList.add(name)));
	}
	this.removeClass = function(list, names) {
		names = fnSplit(names); // Split value by " " (class separator)
		return self.each(list, el => names.forEach(name => el.classList.remove(name)));
	}
	this.toggle = function(list, names, force) {
		names = fnSplit(names); // Split value by " " (class separator)
		return self.each(list, el => names.forEach(name => el.classList.toggle(name, force)));
	}
	this.toggleHide = (list, force) => self.toggle(list, CONFIG.classHide, force);
	this.toggleLink = (el, force) => self.toggleHide(".info-" + el.id, force).setFocus(el.parentNode);

	/*this.css = function(list, prop, value) {
		const camelProp = prop.replace(/(-[a-z])/, g => g.replace("-", EMPTY).toUpperCase());
		return self.each(list, el => { el.style[camelProp] = value; });
	}*/

	// Events
	const ON_CHANGE = "change";
	const fnEvent = (el, name, i, fn, opts) => fnSelf(el.addEventListener(name, ev => fn(el, ev, i) || ev.preventDefault(), opts));
	const fnAddEvent = (el, name, fn, opts) => (el ? fnEvent(el, name, 0, fn, opts) : self);
	const fnAddEvents = (selector, list, name, fn) => self.apply(selector, list, (el, i) => fnEvent(el, name, i, fn));

	this.event = (el, name, fn) => fnAddEvent(fnQuery(el), name, fn);
	this.events = (list, name, fn) => self.each(list, (el, i) => fnEvent(el, name, i, fn));
	this.ready = fn => fnEvent(document, "DOMContentLoaded", 0, fn);
	this.trigger = function(el, name, detail) {
		fnQuery(el).dispatchEvent(detail ? new CustomEvent(name, { detail }) : new Event(name));
		return self;
	}

	this.click = (list, fn) => self.each(list, (el, i) => fnEvent(el, "click", i, fn));
	this.addClick = (el, fn) => fnAddEvent(fnQuery(el), "click", fn);
	this.onclick = this.onClick = self.click;

	this.change = (list, fn) => self.each(list, (el, i) => fnEvent(el, ON_CHANGE, i, fn));
	this.onchange = this.onChange = self.change;

	this.ready(function() {
		var tables, inputs;

		self.setTables = node => { tables = node.querySelectorAll("table"); return self; }
		self.setInputs = fields => { inputs = fields; return self; }

		// Tables, Forms and Inputs helpers
		self.getTable = elem =>  sb.isstr(elem) ? self.find(elem, tables) : elem;
		self.getInput = elem => sb.isstr(elem) ? self.find(elem, inputs) : elem;

		//self.eachInput = (selector, fn) => self.apply(selector, inputs, fn);
		self.getValue = el => { el = self.getInput(el); return el && el.value; }
		self.setValue = (el, value) => { el = self.getInput(el); return el ? fnSetVal(el, value) : self; }

		self.setFocus = el => self.focus(sb.isstr(el) ? self.find(el, inputs) : ab.find(self.inputs(el), fnFocus));
		/*self.autofocus = elements => self.focus(ab.find(elements || inputs, fnFocus)); // Set focus on first visible input
		self.autofocus().reverse(inputs, el => { // Initial focus or reallocate in first error
			const tip = self.get(TIP_ERR_SELECTOR, el.parentNode); // Has error tip
			self.empty(tip) || self.show(tip).addClass(el, CONFIG.classInputError).focus(el);
		});

		self.onChangeForm = (selector, fn) => fnAddEvent(self.getForm(selector), ON_CHANGE, fn);
		self.onSubmitForm = (selector, fn) => fnAddEvent(self.getForm(selector), "submit", fn);
		self.beforeResetForm = (selector, fn) => fnAddEvent(self.getForm(selector), "reset", fn);
		self.afterResetForm = (selector, fn) => fnAddEvent(self.getForm(selector), "reset", (form, ev) => setTimeout(() => fn(form, ev), 1));*/
		//self.onChangeForms = (selector, fn) => fnAddEvents(selector, forms, ON_CHANGE, fn);
		//self.onSubmitForms = (selector, fn) => fnAddEvents(selector, forms, "submit", fn);

		//self.onBlurInput = (selector, fn) => fnAddEvent(self.getInput(selector), "blur", fn);
		self.onChangeInput = (selector, fn) => fnAddEvent(self.getInput(selector), ON_CHANGE, fn);
		self.onChangeInputs = (selector, fn) => fnAddEvents(selector, inputs, ON_CHANGE, fn);
		self.onChangeSelect = (selector, fn) => self.apply(selector, inputs, (el, i) => { fn(el); fnEvent(el, ON_CHANGE, i, fn); });

		/**************** Tables/rows helper ****************/
		self.onTable = (selector, name, fn) => fnAddEvent(self.getTable(selector), name, fn);
		self.onFindRow = (selector, fn) => self.onTable(selector, "find", fn);
		self.onRemoveRow = (selector, fn) => self.onTable(selector, "remove", fn);
		self.onChangeTable = (selector, fn) => self.onTable(selector, ON_CHANGE, fn);
		self.onRenderTable = (selector, fn) => self.onTable(selector, "render", fn);

		function fnToggleTbody(table) {
			const list = table.tBodies; // Bodies list
			if (list[0].children.length) // Has data rows?
				self.show(list[0]).hide(list[1]);
			else
				self.hide(list[0]).show(list[1]);
		}
		function fnRendetTfoot(table, resume, styles) {
			// Trigger event after change data and before render it, after redraw footer
			return self.trigger(table, "render").render(table.tFoot, tpl => sb.format(resume, tpl, styles));
		}
		self.tfoot = function(table, resume, styles) {
			table = self.getTable(table); // find table on tables array
			return table ? fnRendetTfoot(table, resume, styles) : self; // Render footer
		}

		function fnRenderRows(table, data, resume, styles) {
			// Recalc table page indexes
			resume.total = data.length;
			resume.index = resume.index || 0; //default=0
			resume.start = resume.start || 0; //default=0
			resume.pageSize = resume.pageSize || 99; //max=99
			resume.sortDir = table.dataset.sortDir;
			resume.sortBy = table.dataset.sortBy;
			resume.end = resume.start + resume.pageSize;
			resume.page = +(resume.start / resume.pageSize);

			if (resume.sortBy) { // Sort full array, default sort by string
				const fnSort = resume.sort || ((a, b) => sb.cmpBy(a, b, resume.sortBy));
				ab.sort(data, resume.sortDir, fnSort); // Sort before paginate
			}
			else {
				const links = self.getAll(".sort", table.tHead); // Reset orderable links
				self.removeClass(links, "sort-asc sort-desc").addClass(links, "sort-none");
			}
			const aux = (resume.pageSize < resume.total) ? data.slice(resume.start, resume.end) : data;
			resume.size = aux.length; // Num page rows

			styles = styles || {}; // Default styles
			//styles.getValue = styles.getValue || i18n.val;

			const tbody = table.tBodies[0]; // Data rows
			fnRendetTfoot(table, resume, styles); // First render footer
			self.render(tbody, tpl => ab.format(aux, tpl, styles)).trigger(table, "rendered"); // Render rows
			fnToggleTbody(table); // Toggle body if no data

			// Listeners for change, find and remove events
			return self.change(tbody.children, (row, ev, i) => {
				resume.row = row; // TR parent row
				resume.index = resume.start + i; // Real index
				resume.data = data[resume.index]; // Current data row
				resume.element = ev.target; // Element to trigger event
				self.trigger(table, "change-" + ev.target.name, resume); // Specific change event
			}).change(table.tFoot.children, (row, ev, i) => {
				resume.row = row; // TR parent row
				resume.index = i; // Real index
				resume.data = null; // no data
				resume.element = ev.target; // Element to trigger event
				self.trigger(table, "change-" + ev.target.name, resume); // Specific change event
			}).click(self.getAll("a[href]", tbody), el => {
				resume.row = el.closest("tr"); // TR parent row
				resume.index = resume.start + self.indexOf(resume.row); // Real index
				resume.data = data[resume.index]; // Current data row
				resume.element = el; // Element to trigger event
				const name = el.getAttribute("href"); // Name event
				if (name == "#remove") // Remove row link
					fnRemoveRow(table, data, resume, styles);
				else if (sb.starts(name, "#find")) // Is find event?
					self.trigger(table, name.substring(1), resume);
			});
		}
		function fnRemoveRow(table, data, resume, styles) {
			// Confirm, close prev. alerts and trigger remove event
			let ok = table && data && self.confirm(styles?.remove || "remove");
			if (ok && self.closeAlerts().trigger(table, "remove", resume.data).isOk()) {
				data.splice(resume.index, 1); // Remove data row
				resume.start = (resume.size > 1) ? resume.start : 0; // If empty Page => Go first page
				fnRenderRows(table, data, resume, styles); // Build table rows
			}
			return self;
		}

		self.table = function(table, data, resume, styles) {
			table = self.getTable(table); // Search table
			return table ? fnRenderRows(table, data, resume, styles) : self;
		}
		function fnDisplayRow(form, resume, styles, row, index) {
			resume.index = index; // Current position
			resume.data = row; // Current data row
			delete resume.row; // Not row selected
			return self.display(form, row, styles);
		}
		self.selectRow = function(form, data, resume, styles, index) {
			index = nb.range(index, 0, data.length - 1); // close range
			return fnDisplayRow(form, resume, styles, data[index], index);
		}
		self.createRow = (form, resume, styles, row) => fnDisplayRow(form, resume, styles, row, -1);
		self.removeRow = (table, data, resume, styles) => fnRemoveRow(self.getTable(table), data, resume, styles);

		// Table acctions synonyms
		self.renderRows = self.renderTable = self.table;
		self.renderTfoot = self.tFoot = self.tfoot;
	});
}

export default new DomBox();
