
import coll from "../../../components/CollectionHTML.js";
import pf from "../../../components/Primefaces.js";
import i18n from "../../../i18n/langs.js";
import dom from "../../../lib/uae/dom-box.js";

function Uxxiec() {
	const self = this; //self instance
    const RESUME = {}; // Resume table container
    const STYLES = { imp: i18n.isoFloat, fUxxi: i18n.isoDate };
    var op, operaciones; // vinc. container

    this.init = form => {
        form.setAutocomplete("#uxxi", {
            delay: 500, //milliseconds between keystroke occurs and when a search is performed
            minLength: 3, //reduce matches
            source: term => pf.sendTerm("rcFindUxxi", term),
            render: item => (item.num + " - " + item.uxxi + "<br>" + item.desc),
            select: item => { op = item; return item.num + " - " + item.desc; }
        });
        form.addClick("a#add-uxxi", el => {
            if (op) {
                delete op.id; //force insert
                operaciones.push(op); // save container
                dom.table("#op-table", operaciones, RESUME, STYLES);
            }
            form.setval("#uxxi").setFocus("#uxxi")
        });
        dom.onRenderTable("#op-table", table => {
            form.setval("#operaciones", JSON.stringify(operaciones));
            op = null; // reinit vinc.
        });
    }

    this.load = tabUxxiec => {
        operaciones = coll.parse(tabUxxiec.querySelector("#op-json").innerHTML) || []; // preload docs
        dom.setValue("#operaciones").table("#op-table", operaciones, RESUME, STYLES);
        return self;
    }
}

export default new Uxxiec();
