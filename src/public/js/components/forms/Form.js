
import FormBase from "./FormBase.js";
import TextInput from "../inputs/TextInput.js";
import DataList from "../inputs/DataList.js";
import BoolInput from "../inputs/BoolInput.js";
import FloatInput from "../inputs/FloatInput.js";
import DateInput from "../inputs/DateInput.js";
import TimeInput from "../inputs/TimeInput.js";
import TextArea from "../inputs/TextArea.js";
import FileInput from "../inputs/FileInput.js";
import ButtonForm from "../inputs/ButtonForm.js";

// For a valid custom element name, it must: Contain a hyphen (-)
customElements.define("text-input", TextInput, { extends: "input" });
customElements.define("data-list", DataList, { extends: "select" });
customElements.define("float-input", FloatInput, { extends: "input" });
customElements.define("bool-input", BoolInput, { extends: "input" });
customElements.define("date-input", DateInput, { extends: "input" });
customElements.define("time-input", TimeInput, { extends: "input" });
customElements.define("text-area", TextArea, { extends: "textarea" });
customElements.define("file-input", FileInput, { extends: "input" });
customElements.define("btn-form", ButtonForm, { extends: "button" });

export default FormBase;
