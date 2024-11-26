
import i18n from "../../i18n/langs.js";

function Uxxiec() {
	const self = this; //self instance

    let _data; // Current presto data type
    this.getData = () => _data;
    this.get = name => _data[name];
    this.setData = documentos => { _data = documentos; return self; }
    this.set = (name, value) => { _data[name] = value; return self; }

    this.row = data => {
        return `<tr class="tb-data">
            <td>${data.num}</td>
            <td>${data.uxxi}</td>
            <td class="text-right">${i18n.isoFloat(data.imp) || "-"} €</td>
            <td class="text-center">${i18n.isoDate(data.fUxxi)}</td>
            <td>${data.desc}</td>
            <td class="text-center">
                <a href="#remove" class="row-action"><i class="fas fa-times action text-red"></i></a>
            </td>
        </tr>`;
    }
    this.tfoot = resume => `<tr><td colspan="99">Operaciones: ${resume.size}</td></tr>`;
    this.autocomplete = item => (item.num + " - " + item.uxxi + "<br>" + item.desc);
}

export default new Uxxiec();
