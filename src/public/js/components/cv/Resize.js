
function Resize() {
	const self = this; //self instance

	// hack ifPage-frame styles for CV prod.
	const iframe = window.parent.document.querySelector("#ifPage-frame");
	const fnTop = wnd => wnd.scrollTo({ top: 0, behavior: "smooth" });

	this.setHeight = tab => { // set iframe height
		const height = tab?.scrollHeight || iframe.contentDocument.body.scrollHeight;
		iframe.style.height = Math.max(height + 90, 540) + "px"; // update style
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
