
import coll from "../CollectionHTML.js";
import sb from "../types/StringBox.js";
import TextInput from "./TextInput.js";

const EMPTY = [];

export default class Autocomplete extends TextInput {
	#value; // id from item selected
	#time; // call and time indicator (reduce calls)
	#data = EMPTY; // default = empty array
	#index = -1 // current item position in results
	#results; // html element to show matches
	#opts = { // Config. container
		delay: 400, //milliseconds between keystroke occurs and when a search is performed
		minLength: 3, //length to start
		maxLength: 20, //max length for searching
		maxResults: 10, //max showed rows (default = 10)
		optionClass: "option", // child name class
		activeClass: "active", // active option class
		resultsClass: "results" // ul options class
	}

	constructor() {
		super(); // Must call super before 'this'

		// Initialize the element
		this.type = "search";
		this.setAttribute("autocomplete", "off");
		this.#results = this.nextElementSibling || document.createElement("ul");
		this.#results.classList.add(this.#opts.resultsClass);

		// Event fired before char is writen in text
		this.onkeydown = ev => {
			const TAB = 9;
			const UP = 38;
			const DOWN = 40;
			const ENTER = 13;

			if (ev.keyCode == UP)
				return this.#activeItem(this.#index - 1);
			if (ev.keyCode == DOWN)
				return this.#activeItem(this.#index + 1);
			if ((ev.keyCode == TAB))
				return this.#selectItem(this.getCurrentOption(), this.#index);
			if (ev.keyCode == ENTER) {
				ev.preventDefault(); // Avoid fire submit event
				this.#selectItem(this.getCurrentOption(), this.#index);
			}
		}

		// Event fired when value changes, ignore ctrl, alt, etc...
		// also occurs when a user presses the "ENTER" key or clicks the "x" button in an <input> element with type="search"
		this.oninput = ev => {
			clearTimeout(this.#time);  // remove previous search
			const size = coll.size(this.value);
			if (size < this.#opts.minLength)
				return this.reset(); // Min legnth required
			if (size < this.#opts.maxLength) // Reduce server calls and fire source
				this.#time = setTimeout(() => this.source(), this.#opts.delay);
		}

		// Event fired before onblur only when text changes
		this.onchange = ev => { this.value || this.reset(); }
		this.onblur = ev => { setTimeout(this.#removeList, 280); }
	}

	set = (name, fn) => { this.#opts[name] = fn; return this; }
	setDelay = delay => this.set("delay", delay);
	setMinLength = min => this.set("minLength", min);
	source() { throw new Error("Method 'source' must be implemented."); }
	row(item) { return item.label; }
	select(item) { return item.value; }
	setOptions = data => { Object.assign(this.#opts, data); return this; }

	getData = () => this.#data;
	getIndex = () => this.#index;
	getItem = i => this.#data[i ?? this.#index];
	getCurrent = () => this.#data[this.#index];
	getCurrentItem = this.getCurrent; // synonymous
	getCurrentOption = () => this.#results.children[this.#index];
	getCode = sep => sb.getCode(this.value, sep);
	split = sep => sb.split(this.value, sep);

	#isChildren = i => ((0 <= i) && (i < coll.size(this.#results.children)));
	#removeList = () => { this.#results.innerHTML = ""; this.#results.classList.remove(this.#opts.activeClass); }
	#activeItem(i) {
		this.#index = this.#isChildren(i) ? i : this.#index; // current item
		this.#results.children.forEach((li, i) => li.classList.toggle(this.#opts.activeClass, i == this.#index));
	}
	#selectItem(li, i) {
		if (li && this.#isChildren(i)) {
			this.#index = i; // Update current index
			this.setLabel(li.innerText).setval(this.select(this.#data[i])); // first label
		}
		this.#removeList();
	}

	isItem() { return (this.#index > -1); }
	isLoaded() { return this.#value; }
	getValue() { return this.#value; }
	setval(value) { this.#value = value; return this; }
	getLabel() { return this.value; }
	setLabel(label) { this.value = label || ""; return this; } // force label
	setValue(value, label) { return (value ? this.setval(value).setLabel(label) : this.clear()); }
	setItem = item => this.setValue(item.value, item.label); // item = value/label
	reset() { this.#index = -1; this.#value = ""; this.#removeList(); return this; }
	clear() { return this.reset().setLabel(); } // not fire event
	reload = () => {
		this.value = ""; // Clear input
		this.focus(); // Set focus
		return this.reset();
	}
	render = data => {
		this.reset(); // clear previous results
		this.#data = data || EMPTY; // Force not unset var
		this.#data.slice(0, this.#opts.maxResults).forEach((data, i) => {
			const label = sb.wrap(this.row(data, i, this.#data), this.value);
			this.#results.innerHTML += `<li class="${this.#opts.optionClass}">${label}</li>`;
		});
		this.#results.children.forEach((li, i) => {
			li.addEventListener("click", ev => this.#selectItem(li, i));
		});
		this.#results.classList.add(this.#opts.activeClass);
	}
}
