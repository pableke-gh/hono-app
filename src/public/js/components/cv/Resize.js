
function Resize() {
	const self = this; //self instance

	// hack ifPage-frame styles for CV prod.
	const iframe = window.parent.document.querySelector("#ifPage-frame");
	const fnTop = wnd => wnd.scrollTo({ top: 0, behavior: "smooth" });

	this.setHeight = tab => { // set iframe height
		iframe.style.height = tab ? (Math.max(tab.scrollHeight + 80, 520) + "px") : iframe.style.height;
	}
	this.resize = tab => { // set iframe height
		self.setHeight(tab); // recalc new height
		fnTop(window.parent); // parent to top
	}

	if (iframe)
		iframe.setAttribute("scrolling", "no"); // disable scrollbars
	else {
		self.setHeight = globalThis.void;
		self.resize = () => fnTop(window);
	}
}

export default new Resize();
