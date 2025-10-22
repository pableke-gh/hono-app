
import select from "./SelectBox.js";
import sb from "../types/StringBox.js";
import i18n from "../../i18n/langs.js";

export default function(opts) {
	opts = opts || {}; // default options
	opts.dateClass = opts.dateClass || "ui-date"; // Date type
	opts.boolClass = opts.boolClass || "ui-bool"; // Boolean type
	opts.floatFormatClass = opts.floatFormatClass || "ui-float"; // Float i18n
	opts.integerFormatClass = opts.integerFormatClass || "ui-integer"; // Integer i18n
	opts.numberFormatClass = opts.numberFormatClass || "ui-number"; // Number type
	opts.inputErrorClass = opts.inputErrorClass || "ui-error"; // Input error styles
	opts.tipErrorClass = opts.tipErrorClass || "ui-errtip"; // Tip error style
	opts.negativeNumClass = opts.negativeNumClass || "text-red"; // Negative numbers styles
	//opts.checkAllClass = opts.checkAllClass || "ui-check-all"; // Check all related checkboxes

	const self = this; //self instance

	const fnContains = (el, name) => el.classList.contains(name);
	const isCheckbox = el => (el.type == "checkbox");
	const fnNumber = (el, value) => {
		el.value = value || ""; // Show formatted value and style
		el.classList.toggle(opts.negativeNumClass, el.value.startsWith("-"));
	}

	this.setOptions = data => {
		Object.assign(opts, data);
		return self;
	}

	this.focus = el => { el?.focus(); return self; }
	this.getAttr = (el, name) => (el && el.getAttribute(name));
	this.setAttr = (el, name, value) => { el && el.setAttribute(name, value); return self; }
	this.delAttr = (el, name) => { el && el.removeAttribute(name); return self; }
    this.render = (el, data, i, size) => { el && el.render(data, i, size); return self; }
	this.empty = el => (!el || !el.innerHTML || (el.innerHTML.trim() === ""));

	this.addClass = (el, name) => { el && el.classList.add(name); return self; }
	this.removeClass = (el, name) => { el && el.classList.remove(name); return self; }

	this.val = el => el?.value;
	this.getValue = el => {
		if (fnContains(el, opts.floatFormatClass))
			return i18n.toFloat(el.value); // Float
		if (fnContains(el, opts.integerFormatClass))
			return i18n.toInt(el.value); // Integer
		if (fnContains(el, opts.numberFormatClass))
			return el.value ? +el.value : null; // Number type directly
		return el.value && el.value.trim(); // String trimed by default
	}

	this.load = (el, data) => { // View to JSON
		if (!el.name)
			return self; // No value to save
		if (isCheckbox(el)) {
			if (!el.checked)
				return self; // not selected
			data[el.name] = data[el.name] || [];
			data[el.name].push(el.value); // Array type
		}
		else
			data[el.name] = self.getValue(el);
		return self;
	}

	this.setval = (el, value) => {
		if (select.isSelect(el) && !value)
			el.selectedIndex = 0; // first option
		else
			el.value = value || ""; // force String
		return self;
	}
	this.setValue = (el, value) => {
		if (el.type == "date") { // input type date
			el.value = sb.strDate(value); // yyyy-mm-dd
			el.updateDateRange(); // is date range => update attributes
		}
		else if (el.type == "time") // input type time
			el.value = sb.strTimeShort(value); // hh:mm
		else if (fnContains(el, opts.floatFormatClass))
			fnNumber(el, i18n.isoFloat(value));
		else if (fnContains(el, opts.integerFormatClass))
			fnNumber(el, i18n.isoInt(value));
		else if (fnContains(el, opts.boolClass))
			el.value = i18n.boolval(value);
		else if (isCheckbox(el)) // Array type
			el.checked = value && value.includes(el.value);
		else if (el.type === "radio")
			el.checked = (el.value == value);
		else
			self.setval(el, value); // default
		return self;
	}
	this.setDateRange = (el1, el2, fnBlur) => {
		fnBlur = fnBlur || globalThis.void; // default = void
		el1.setAttribute("max", el2.value); // update attribute
		el2.setAttribute("min", el1.value); // update attribute
		el1.onblur = ev => { el2.setAttribute("min", el1.value); fnBlur(ev, el1, el2); };
		el2.onblur = ev => { el1.setAttribute("max", el2.value); fnBlur(ev, el2, el1); };
		el1.updateDateRange = () => { el2.setAttribute("min", el1.value); }; // fired on set value
		el2.updateDateRange = () => { el1.setAttribute("max", el2.value); }; // fired on set value
		return self;
	}

	this.file = (el, fn) => {
		const reader = new FileReader();
		let file, index; // file, position

		const fnLoad = i => {
			file = el.files[i]; // multifile
			file && reader.readAsArrayBuffer(file); //reader.readAsText(file, "UTF-8");
		}
		reader.onload = ev => { // event on load file
			fn(ev, el, file, reader.result, index);
			fnLoad(++index);
		}
		el.addEventListener("change", () => {
			index = 0; // restart index
			fnLoad(index);
		});
	}

	this.setError = (el, tip) => {
		if (!tip) // tip message optional
			return self; // no error message
		el.focus(); // set focus on error
		el.classList.add(opts.inputErrorClass);
		el.next("." + opts.tipErrorClass)?.setMsg(tip);
		return self;
	}

	this.init = el => { // input initialization
		if (fnContains(el, opts.floatFormatClass))
			el.addEventListener("change", ev => fnNumber(el, i18n.fmtFloat(el.value)));
		else if (fnContains(el, opts.integerFormatClass))
			el.addEventListener("change", ev => fnNumber(el, i18n.fmtInt(el.value)));
		else if (fnContains(el, opts.dateClass)) {
			el.type = "date"; // Hack PF type
			el.updateDateRange = globalThis.void;
		}
		/*else if (fnContains(el, opts.checkAllClass))
			el.addEventListener("click", ev => {
				const fnCheck = input => (isCheckbox(input) && (input.name == el.id));
				form.elements.forEach(input => { if (fnCheck(input)) input.checked = el.checked; });
		});*/
		return self;
	}
}
