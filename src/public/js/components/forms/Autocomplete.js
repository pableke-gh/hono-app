
import coll from "../CollectionHTML.js";
import sb from "../types/StringBox.js";

const EMPTY = [];
const fnEmpty = () => EMPTY;
const fnParam = param => param;

export default function(autocomplete, opts) {
	autocomplete = globalThis.isstr(autocomplete) ? $1(autocomplete) : autocomplete;
	autocomplete = autocomplete || document.createElement("input"); // create input element

	opts = opts || {}; // Config. container
	opts.delay = opts.delay || 400; //milliseconds between keystroke occurs and when a search is performed
	opts.minLength = opts.minLength || 3; //length to start
	opts.maxLength = opts.maxLength || 20; //max length for searching
	opts.maxResults = opts.maxResults || 10; //max showed rows (default = 10)
	opts.optionClass = opts.optionClass || "option"; // child name class
	opts.activeClass = opts.activeClass || "active"; // active option class

	opts.source = opts.source || fnEmpty; //empty source by default
	opts.render = opts.render || fnParam; //render label on autocomplete
	opts.select = opts.select || fnParam; //set value in id input
	opts.afterSelect = opts.afterSelect || globalThis.void; //fired after load inputs
	opts.onReset = opts.onReset || globalThis.void; //fired when no value selected

	const self = this; //self instance
	const inputValue = autocomplete.nextElementSibling || document.createElement("input");
	const resultsHTML = inputValue.nextElementSibling || document.createElement("ul");

	// Force default props / attr
	inputValue.type = "hidden";
	autocomplete.type = "search";
	autocomplete.setAttribute("autocomplete", "off");

	let _time; // call and time indicator (reduce calls)
	let _results = EMPTY; // default = empty array
	let _index = -1 // current item position in results

	this.set = (name, fn) => { opts[name] = fn; return self; }
	this.setDelay = delay => self.set("delay", delay);
	this.setMinLength = min => self.set("minLength", min);
	this.setSource = fn => { opts.source = fn; return self; }
	this.setRender = fn => { opts.render = fn; return self; }
	this.setSelect = fn => { opts.select = fn; return self; }
	this.setAfterSelect = fn => { opts.afterSelect = fn; return self; }
	this.setReset = fn => { opts.onReset = fn; return self; }
	this.setItemMode = minLength => self.setMinLength(minLength || opts.minLength).setSelect(item => item.value).setRender(item => item.label); 

	this.getData = () => _results;
	this.getIndex = () => _index;
	this.getItem = i => _results[i ?? _index];
	this.getCurrentItem = () => _results[_index];
	this.getCurrentOption = () => resultsHTML.children[_index];
	this.getCode = sep => sb.getCode(autocomplete.value, sep);

	this.isset = () => autocomplete;
	this.isItem = () => (_index > -1);
	this.isLoaded = () => inputValue.value;
	this.getInputValue = () => inputValue;
	this.getAutocomplete = () => autocomplete;
	this.getValue = () => inputValue.value;
	this.setValue = (value, label) => {
		if (value) {
			inputValue.value = value;
			autocomplete.value = label;
		}
		else
			inputValue.value = autocomplete.value = "";
		return self;
	}
	this.setItem = item => self.setValue(item.value, item.label);
	//this.after = el => el.after(autocomplete, inputValue, resultsHTML);
	/*this.append = parent => {
		const label = document.createElement("label");
		label.append('<div class="label required">**Titulo**:</div>');
		label.append(autocomplete, inputValue, resultsHTML);
		label.append('<div class="ui-errtip"></div>');
		parent.appendChild(label);
		return self;
	}*/

	const isChildren = i => ((0 <= i) && (i < coll.size(resultsHTML.children)));
	const removeList = () => { resultsHTML.innerHTML = ""; resultsHTML.classList.remove(opts.activeClass); }
	const fnClear = () => { _index = -1; inputValue.value = ""; removeList(); return self; }

	function activeItem(i) {
		_index = isChildren(i) ? i : _index; // current item
		resultsHTML.children.forEach((li, i) => li.classList.toggle(opts.activeClass, i == _index));
	}
	function selectItem(li, i) {
		if (li && isChildren(i)) {
			_index = i; // Update current index
			self.setValue(opts.select(_results[i], self), li.innerText);
			opts.afterSelect(_results[i], self); // fired after update inputs
		}
		removeList();
	}

	this.reset = () => {
		if (inputValue.value) // is selected data
			opts.onReset(fnClear()); // Fire event onFinish
		else
			fnClear(); // Reset previous values
		return self;
	}
	this.reload = () => {
		self.reset(); // 1º Reset all data
		autocomplete.value = ""; // Clear input
		autocomplete.focus(); // Set focus
		return self;
	}
	this.render = data => {
		fnClear(); // clear previous results
		_results = data || EMPTY; // Force not unset var
		_results.slice(0, opts.maxResults).forEach((data, i) => {
			const label = sb.wrap(opts.render(data, i, _results), autocomplete.value);
			resultsHTML.innerHTML += `<li class="${opts.optionClass}">${label}</li>`;
		});
		resultsHTML.children.forEach((li, i) => {
			li.addEventListener("click", ev => selectItem(li, i));
		});
		resultsHTML.classList.add(opts.activeClass);
		_time = 0; // restore sarches
	}

	// Event fired before char is writen in text
	autocomplete.onkeydown = ev => {
		const TAB = 9;
		const UP = 38;
		const DOWN = 40;
		const ENTER = 13;

		if (ev.keyCode == UP)
			return activeItem(_index - 1);
		if (ev.keyCode == DOWN)
			return activeItem(_index + 1);
		if ((ev.keyCode == TAB))
			return selectItem(self.getCurrentOption(), _index);
		if (ev.keyCode == ENTER) {
			ev.preventDefault(); // Avoid fire submit event
			selectItem(self.getCurrentOption(), _index);
		}
	}
	// Event fired when value changes, ignore ctrl, alt, etc...
	// also occurs when a user presses the "ENTER" key or clicks the "x" button in an <input> element with type="search"
	autocomplete.oninput = ev => {
		if (_time) // Avoid new searchs
			return ev.preventDefault();
		const size = coll.size(autocomplete.value);
		if (size < opts.minLength)
			return self.reset(); // Min legnth required
		if (size < opts.maxLength) // Reduce server calls and fire source
			_time = setTimeout(() => opts.source(autocomplete.value, self), opts.delay);
	}
	// Event occurs when a user presses the "ENTER" key or clicks the "x" button in an <input> element with type="search"
	/*autocomplete.onsearch = ev => { autocomplete.value || self.reset(); }*/
	// Event fired before onblur only when text changes
	autocomplete.onchange = ev => { autocomplete.value || self.reset(); }
	autocomplete.onblur = ev => { setTimeout(removeList, 280); }
}
