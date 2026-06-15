
import tabs from "../../components/Tabs.js";
import form from "../modules/isuite.js";

const fnHideTable = table => table.parentNode.hide();
const fnShowTable = function(table) {
	if (this.numrows) {
		table.parentNode.show();
		table.previousElementSibling.render(TB_CONFIG.current);
		table.querySelectorAll(".tb-resume-final").forEach(el => { el.nextElementSibling.style.display = "none"; });
	}
	else
		$(table).tbReset(TB_CONFIG);
	table.onclick = tabs.setHeight;
	tabs.setHeight();
}

const TB_CONFIG = { // Inicializo la configuracion y eventos de la tabla
	LatinFloatParse: toNumber, LatinFloat: nfLatin, LatinDateParse: toDate, LatinDate: dfLatin, 
	/*orderNameClass: "ui-sortable-column-icon ui-icon ui-icon-carat-2-n-s",*/ descNameClass: "ui-icon-triangle-1-s", ascNameClass: "ui-icon-triangle-1-n",
	headColumns: '<td colspan="@columns_1;">@text;</td><td class="currency">@importeSumFmt;</td>',
	footColumns: '<td colspan="@columns_1;">Filas: @numrows;</td><td class="currency">@importeSumFmt;</td>',
	classColumns: { importe: "text-right" },
	primaryKey: "refreb",

	tables: {
		n19: {
			typeColumns: { fCobro: "DateTime", importe: "Number" },
			styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
			afterPush: fnShowTable,
			afterReset: fnHideTable
		},
		n43: {
			typeColumns: { fCobro: "DateTime", importe: "Number" },
			styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
			afterPush: fnShowTable,
			afterReset: fnHideTable,
		},
		n57: {
			typeColumns: { fCobro: "DateTime", idActividad: "Number", importe: "Number" },
			styleColumns: { fCobro: "LatinDate", idActividad: "Integer", importe: "LatinFloat" },
			afterPush: fnShowTable,
			afterReset: fnHideTable
		},
		tpvs: {
			typeColumns: { fCobro: "DateTime", importe: "Number" },
			styleColumns: { fCobro: "LatinDate", importe: "LatinFloat" },
			afterPush: fnShowTable,
			afterReset: fnHideTable
		},

		fcb: {
			typeColumns: { fAsiento: "DateTime", impAplicacion: "Number" },
			styleColumns: { fAsiento: "LatinDate", impAplicacion: "LatinFloat" },
			headColumns: '<td colspan="7">@text;</td><td class="currency">@impAplicacionSumFmt;</td><td colspan="3"></td>',
			footColumns: '<td colspan="7">Filas: @numrows;</td><td class="currency">@impAplicacionSumFmt;</td><td colspan="3"></td>',
			classColumns: { impAplicacion: "text-right" },
			onRead: function(data) { Object.assign(data, data.fAsiento.toObject()); return true; }
		},
		fcbpivot: {
			footColumns: '<td>Filas: @numrows;</td><td class="currency">@EneroSumFmt;</td><td class="currency">@FebreroSumFmt;</td><td class="currency">@MarzoSumFmt;</td><td class="currency">@AbrilSumFmt;</td><td class="currency">@MayoSumFmt;</td><td class="currency">@JunioSumFmt;</td><td class="currency">@JulioSumFmt;</td><td class="currency">@AgostoSumFmt;</td><td class="currency">@SeptiembreSumFmt;</td><td class="currency">@OctubreSumFmt;</td><td class="currency">@NoviembreSumFmt;</td><td class="currency">@DiciembreSumFmt;</td><td class="currency">@impAplicacionSumFmt;</td>',
			classColumns: { number: "text-right", impAplicacion: "textuc text-right" }
		},
		gc: {
			footColumns: '<td colspan="4">Filas: @numrows;</td><td class="currency">@drnAcumSumFmt;</td><td class="currency">@rnAcumSumFmt;</td><td></td><td class="currency">@orAcumSumFmt;</td><td class="currency">@ctHabilitadoSumFmt;</td><td colspan="3"></td>',
			classColumns: { porGg: "text-right", drnAcum: "text-right", rnAcum: "text-right", orAcum: "text-right", maxHabilitar: "text-right", ctHabilitado: "text-right", txtHabilitar: "text-right" },

			//beforeRead: loading,
			onRead: function(data, row) {
				data.porGg = data.porGg ?? "";
				data.modalidad = attr(row, "modalidad");
				data.impCpAcum = attr(row, "impCpAcum");
				data.impHabilitar = attr(row, "impHabilitar");
				data.txtCpAcum = (!data.modalidad || (data.modalidad == "I") || (data.modalidad == "N")) 
									? "No Aplica" : nfLatin(data.impCpAcum);
				data.txtHabilitar = (!data.modalidad || (data.modalidad == "I")) ? "Sin Ingreso"
									: (data.modalidad == "N") ? "No Vigente"
									: (data.modalidad == "E") ? "A Eliminar"
									: (isNaN(data.impHabilitar) || (data.modalidad == "S")) ? "A Solicitud"
									: nfLatin(data.impHabilitar);
				data.maxHabilitar = data.maxHabilitar || "";
				data.aipOrg = data.aipOrg || "";
				data.fCreacion = toDate(attr(row, "fCreacion"));
				return true;
			},
			afterRead: table => { table.tBodies[0].classList.remove("hide"); /*working();*/ },
			onOrder: function(a, b, name) { return (name == "txtHabilitar") ? cmp(a[name].lpad(15), b[name].lpad(15)) : cmp(a[name], b[name]); },
			onFilter: function(row) {
				var elem = $("select#impHabilitar");
				var i = elem.prop("selectedIndex");
				var ok = (i == 0) || ((i < 4) && (row.txtHabilitar == text($("option", elem).get(i))));
				ok = ok || ((i == 4) && (row.txtHabilitar.endsWith("00")) && (row.impHabilitar == 0));
				ok = ok || ((i == 5) && (row.impHabilitar > 0));
				return ok && form.ilike(row);
			}
		}
	},

	onFilter: function(row) { return form.ilike(row); },
	createGroup: function(node, row, name) { node.text += row[name + "Desc"] ? (" - " + row[name + "Desc"]) : ""; }
};

export default TB_CONFIG;
