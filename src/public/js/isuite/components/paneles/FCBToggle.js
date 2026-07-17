
import ButtonForm from "../../../core/components/forms/ButtonForm.js"

export default class FCBToggleButton extends ButtonForm {
	execute() {
		if (this.isPivot())
			this.setTableMode();
		else
			this.setPivotMode();
	}

	// is table if show pivot icon
	isTabla = () => this.firstElementChild.classList.contains("fa-calendar-alt");
	isPivot = () => this.firstElementChild.classList.contains("fa-table");

	setTableMode() {
		const table = this.form.getPanel();
		table.classList.remove("hide");
		table.nextElementSibling.classList.add("hide");
		this.setAttribute("title", "Pivota la tabla sobre el Grupo de Gasto");
		this.innerHTML = '<i class="far fa-calendar-alt"></i>Mensual';
	}

	setPivotMode() {
		const table = this.form.getPanel();
		table.classList.add("hide");
		table.nextElementSibling.classList.remove("hide");
		this.setAttribute("title", "Muestra los datos en formato tabla");
		this.innerHTML = '<i class="fa fa-table"></i>Tabla';
	}
}
