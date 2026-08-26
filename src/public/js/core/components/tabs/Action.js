
export default class ActionLink extends HTMLAnchorElement {
	execute() { // override in subclass
		console.error("Execute method must be implemented!");
	}

	connectedCallback() {
		this.addEventListener("click", ev => {
			ev.preventDefault(); // avoid page reload
			this.execute();
		});
	}
}
