
import i18n from "../i18n/langs.js";

export default function(container, opts) {
    if (!container)
        return; // Input not found

    opts = opts || {}; // Init. options
    opts.name = opts.name || "_test";
    opts.activeClassName = opts.activeClassName || "active";
    opts.checkedClassName = opts.checkedClassName || "checked";

    opts.msgEmptyOption = opts.msgEmptyOption || "Select options";
    opts.emptyOption = opts.emptyOption || `<span>${i18n.get(opts.msgEmptyOption)}</span>`;

    opts.dropdownIcon = opts.dropdownIcon || '<i class="fas fa-chevron-down icon"></i>';
    opts.checkedIcon = opts.checkedIcon || '<i class="far fa-square icon"></i>';
    opts.uncheckedIcon = opts.uncheckedIcon || '<i class="far fa-check-square icon"></i>';

    opts.onChange = opts.onChange || globalThis.void; // fired on change list
    opts.onReset = opts.onReset || globalThis.void; // fired on reset list

    const self = this; //self instance
    const label = container.firstElementChild; // first = label element
    const button = label.nextElementSibling; // second = button dropdown
    const options = button.nextElementSibling; // third = selectable options

    const fnItem = (item, i) => `<span class="${opts.checkedClassName}">${item.label}<i data-index="${i}" class="fas fa-times icon"></i></span>`;
    const fnSelected = (item, i) => item.checked ? fnItem(item, i) : "";

    const fnUnchecked = item => `<li><input type="checkbox" name="${opts.name}" value="${item.value}" class="hide"/>${opts.checkedIcon}${item.label}</li>`;
    const fnChecked = item => `<li><input type="checkbox" name="${opts.name}" value="${item.value}" checked class="hide"/>${opts.uncheckedIcon}${item.label}</li>`;
    const fnRender = item => item.checked ? fnChecked(item) : fnUnchecked(item);
    let _data; // items container

    // Handlers
	this.isset = () => container;
    this.getData = () => _data;
    this.getItems = () => _data;
    this.getChecked = () => _data.filter(item => item.checked);
    this.getSelected = self.getChecked;

    this.reset = () => {
        _data = []; // clear items
        button.innerHTML = opts.emptyOption + opts.dropdownIcon; // Empty text = first option
        options.innerHTML = `<li>${i18n.get(opts.msgEmptyOption)}</li>`; // Empty text = first option
        opts.onReset(self); // Fire reset event
        return self;
    }

    this.setItems = function(items) {
        if (!JSON.size(items))
            return self.reset();

        _data = items; // init. items
        button.innerHTML = items.map(fnSelected).join("") || opts.emptyOption;
        button.innerHTML += opts.dropdownIcon;
        button.querySelectorAll("[data-index]").forEach(icon => { // selected event
            icon.onclick = ev => {
                delete items[+icon.dataset.index].checked;
                self.setItems(items);
                ev.stopPropagation();
            }
        });

        options.innerHTML = items.map(fnRender).join(""); // Render items
        options.children.forEach((li, i) => { // selected event
            li.onclick = ev => {
                items[i].checked = !items[i].checked;
                self.setItems(items);
                ev.stopPropagation();
            }
        });

        opts.onChange(items, self); // call change event
        return self;
	}

    // Events and handlers
    document.onclick = () => options.classList.remove(opts.activeClassName);
    label.onclick = ev => { ev.stopPropagation(); button.focus(); }
    button.onclick = ev => {
        options.classList.toggle(opts.activeClassName);
        ev.stopPropagation();
    }
}
